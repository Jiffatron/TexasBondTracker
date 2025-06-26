import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedFinancialData } from '@/types';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class AuditPDFParser {
  private extractedText: string = '';
  private debugLogs: string[] = [];
  private parsingResults: any = {};

  async parsePDF(file: File): Promise<ExtractedFinancialData> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      // Extract text from all pages with better formatting preservation
      let fullText = '';
      let pageTexts: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Sort text items by position (top to bottom, left to right)
        const sortedItems = textContent.items.sort((a: any, b: any) => {
          const yDiff = b.transform[5] - a.transform[5]; // Y position (top to bottom)
          if (Math.abs(yDiff) > 5) return yDiff > 0 ? 1 : -1; // Different lines
          return a.transform[4] - b.transform[4]; // X position (left to right)
        });

        // Group text by lines and preserve structure
        let currentY = -1;
        let currentLine = '';
        let pageText = '';

        for (const item of sortedItems) {
          const y = Math.round(item.transform[5]);
          const text = item.str.trim();

          if (text === '') continue;

          // New line detected
          if (currentY !== -1 && Math.abs(y - currentY) > 5) {
            if (currentLine.trim()) {
              pageText += currentLine.trim() + '\n';
            }
            currentLine = text;
          } else {
            // Same line, add space if needed
            if (currentLine && !currentLine.endsWith(' ') && !text.startsWith(' ')) {
              currentLine += ' ';
            }
            currentLine += text;
          }
          currentY = y;
        }

        // Add the last line
        if (currentLine.trim()) {
          pageText += currentLine.trim() + '\n';
        }

        pageTexts.push(pageText);
        fullText += `\n--- PAGE ${i} ---\n` + pageText;
      }

      this.extractedText = fullText;
      this.debugLog(`Extracted text from ${pdf.numPages} pages, ${fullText.length} characters`);

      const result = this.extractFinancialData();
      this.parsingResults = result;

      return result;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF. Please ensure the file is a valid PDF.');
    }
  }

  private extractFinancialData(): ExtractedFinancialData {
    const text = this.extractedText.toLowerCase();
    
    return {
      netPosition: this.extractNetPosition(text),
      fundBalance: this.extractFundBalance(text),
      revenues: this.extractRevenues(text),
      expenditures: this.extractExpenditures(text),
      districtName: this.extractDistrictName(text),
      fiscalYear: this.extractFiscalYear(text)
    };
  }

  private extractNetPosition(text: string): ExtractedFinancialData['netPosition'] {
    // Look for Statement of Net Position section with more variations
    const netPositionSection = this.findSection(text, [
      'statement of net position',
      'government-wide statement of net position',
      'government wide statement of net position',
      'net position',
      'statement of net assets',
      'government-wide financial statements',
      'exhibit a-1'
    ]);

    return {
      totalAssets: this.extractAmount(netPositionSection, [
        'total assets',
        'total current assets',
        'total assets and deferred outflows',
        'assets and deferred outflows of resources',
        'total assets and deferred outflows of resources',
        'assets',
        'current assets',
        'total governmental activities assets'
      ]),
      totalLiabilities: this.extractAmount(netPositionSection, [
        'total liabilities',
        'total current liabilities',
        'total liabilities and deferred inflows',
        'liabilities and deferred inflows of resources',
        'total liabilities and deferred inflows of resources',
        'liabilities',
        'current liabilities',
        'total governmental activities liabilities'
      ]),
      netPosition: this.extractAmount(netPositionSection, [
        'net position',
        'total net position',
        'net assets',
        'total net assets',
        'net position of governmental activities',
        'governmental activities net position',
        'total governmental activities net position'
      ])
    };
  }

  private extractFundBalance(text: string): ExtractedFinancialData['fundBalance'] {
    const balanceSection = this.findSection(text, [
      'balance sheet',
      'governmental funds balance sheet',
      'governmental funds - balance sheet',
      'fund balance',
      'balance sheet - governmental funds',
      'exhibit c-1',
      'exhibit b-1'
    ]);

    return {
      generalFund: this.extractAmount(balanceSection, [
        'general fund',
        'fund balance - general fund',
        'fund balance general fund',
        'total fund balance general fund',
        'fund balance assigned general fund',
        'fund balance unassigned general fund',
        'total general fund'
      ]),
      debtServiceFund: this.extractAmount(balanceSection, [
        'debt service fund',
        'fund balance - debt service',
        'fund balance debt service',
        'total fund balance debt service fund',
        'debt service',
        'total debt service fund'
      ])
    };
  }

  private extractRevenues(text: string): ExtractedFinancialData['revenues'] {
    const revenueSection = this.findSection(text, [
      'revenues',
      'statement of revenues',
      'revenues by source',
      'statement of revenues expenditures',
      'revenues expenditures and changes',
      'governmental funds revenues',
      'exhibit c-2',
      'exhibit b-2'
    ]);

    return {
      local: this.extractAmount(revenueSection, [
        'local sources',
        'local revenue',
        'local revenues',
        'property taxes',
        'local and intermediate sources',
        'local and intermediate',
        'total local and intermediate sources',
        'local property taxes',
        'local tax revenues'
      ]),
      state: this.extractAmount(revenueSection, [
        'state sources',
        'state revenue',
        'state revenues',
        'state programs',
        'state program revenues',
        'foundation school program',
        'state aid',
        'total state program revenues',
        'state funding'
      ]),
      federal: this.extractAmount(revenueSection, [
        'federal sources',
        'federal revenue',
        'federal revenues',
        'federal programs',
        'federal program revenues',
        'federal grants',
        'total federal program revenues',
        'federal funding'
      ])
    };
  }

  private extractExpenditures(text: string): ExtractedFinancialData['expenditures'] {
    const expenditureSection = this.findSection(text, [
      'expenditures',
      'statement of expenditures',
      'expenditures by function'
    ]);

    return {
      instruction: this.extractAmount(expenditureSection, [
        'instruction',
        'instructional services',
        'regular instruction'
      ]),
      admin: this.extractAmount(expenditureSection, [
        'administration',
        'administrative',
        'general administration',
        'school administration'
      ]),
      debtService: this.extractAmount(expenditureSection, [
        'debt service',
        'principal on long-term debt',
        'interest on long-term debt'
      ])
    };
  }

  private extractDistrictName(text: string): string | undefined {
    // Look for common patterns in ISD names
    const isdPattern = /([a-z\s]+(?:independent school district|isd))/i;
    const match = text.match(isdPattern);
    return match ? match[1].trim() : undefined;
  }

  private extractFiscalYear(text: string): string | undefined {
    // Look for fiscal year patterns
    const yearPatterns = [
      /fiscal year (\d{4})/i,
      /year ended august 31, (\d{4})/i,
      /august 31, (\d{4})/i
    ];

    for (const pattern of yearPatterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    return undefined;
  }

  private findSection(text: string, keywords: string[]): string {
    const lowerText = text.toLowerCase();

    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();

      // Try exact match first
      let index = lowerText.indexOf(lowerKeyword);

      // If not found, try fuzzy matching (allowing for extra spaces/punctuation)
      if (index === -1) {
        const fuzzyKeyword = lowerKeyword.replace(/\s+/g, '\\s+').replace(/[^\w\s]/g, '\\s*');
        const fuzzyPattern = new RegExp(fuzzyKeyword, 'i');
        const match = text.match(fuzzyPattern);
        if (match) {
          index = match.index || 0;
        }
      }

      if (index !== -1) {
        // Look for the end of this section (next major heading or end of document)
        const sectionStart = index;
        let sectionEnd = index + 8000; // Default to 8000 chars

        // Try to find natural section boundaries
        const nextSectionPatterns = [
          /\n\s*statement of/i,
          /\n\s*notes to/i,
          /\n\s*required supplementary/i,
          /\n\s*combining/i,
          /\n\s*schedule/i
        ];

        for (const pattern of nextSectionPatterns) {
          const nextMatch = text.substring(sectionStart + 100).match(pattern);
          if (nextMatch && nextMatch.index) {
            const potentialEnd = sectionStart + 100 + nextMatch.index;
            if (potentialEnd < sectionEnd) {
              sectionEnd = potentialEnd;
            }
          }
        }

        const section = text.substring(sectionStart, Math.min(sectionEnd, text.length));
        this.debugLog(`Found section for "${keyword}": ${section.length} characters`);
        return section;
      }
    }

    this.debugLog(`⚠️ No section found for keywords: ${keywords.join(', ')}`);
    return text; // Return full text if no section found
  }

  private extractAmount(text: string, keywords: string[]): number {
    const lowerText = text.toLowerCase();

    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();

      // Multiple pattern attempts for better matching
      const patterns = [
        // Standard format: "Total Assets $ 123,456,789"
        new RegExp(lowerKeyword + '[\\s\\$,\\(\\)]*([\\d,]+)', 'i'),

        // Table format: "Total Assets    123,456,789"
        new RegExp(lowerKeyword + '\\s+([\\d,]+)', 'i'),

        // With dollar sign: "Total Assets $123,456,789"
        new RegExp(lowerKeyword + '\\s*\\$\\s*([\\d,]+)', 'i'),

        // Parentheses format: "Total Assets (123,456,789)"
        new RegExp(lowerKeyword + '[\\s]*\\(([\\d,]+)\\)', 'i'),

        // Line break format: "Total Assets\n123,456,789"
        new RegExp(lowerKeyword + '\\s*\\n\\s*([\\d,]+)', 'i'),

        // Colon format: "Total Assets: 123,456,789"
        new RegExp(lowerKeyword + '\\s*:\\s*([\\d,]+)', 'i'),

        // Multiple spaces/tabs: "Total Assets        123,456,789"
        new RegExp(lowerKeyword + '\\s{2,}([\\d,]+)', 'i')
      ];

      for (const pattern of patterns) {
        const match = lowerText.match(pattern);
        if (match) {
          // Find the actual position in original text to preserve formatting
          const matchIndex = lowerText.indexOf(match[0]);
          if (matchIndex !== -1) {
            const originalMatch = text.substring(matchIndex, matchIndex + match[0].length);
            const numberMatch = originalMatch.match(/([\\d,]+)/);

            if (numberMatch) {
              const amount = numberMatch[1].replace(/,/g, '');
              const parsed = parseInt(amount, 10);

              if (!isNaN(parsed) && parsed > 0) {
                this.debugLog(`💰 Found amount for "${keyword}": ${parsed.toLocaleString()}`);
                return parsed;
              }
            }
          }
        }
      }

      // Try fuzzy keyword matching if exact match fails
      const fuzzyKeyword = lowerKeyword.replace(/\s+/g, '\\s+');
      const fuzzyPattern = new RegExp(fuzzyKeyword + '[\\s\\$,\\(\\)]*([\\d,]+)', 'i');
      const fuzzyMatch = lowerText.match(fuzzyPattern);

      if (fuzzyMatch) {
        const amount = fuzzyMatch[1].replace(/,/g, '');
        const parsed = parseInt(amount, 10);
        if (!isNaN(parsed) && parsed > 0) {
          this.debugLog(`💰 Found amount (fuzzy) for "${keyword}": ${parsed.toLocaleString()}`);
          return parsed;
        }
      }
    }

    this.debugLog(`⚠️ No amount found for keywords: ${keywords.join(', ')}`);
    return 0;
  }

  // Debug logging method
  private debugLog(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.debugLogs.push(logEntry);
    console.log(logEntry);
  }

  // Method to get debug information about the parsing process
  getDebugInfo(): any {
    return {
      timestamp: new Date().toISOString(),
      extractedTextLength: this.extractedText.length,
      extractedTextPreview: this.extractedText.substring(0, 1000) + '...',
      sectionsFound: this.findAllSections(),
      commonPatterns: this.findCommonPatterns(),
      parsingResults: this.parsingResults,
      debugLogs: this.debugLogs,
      fullExtractedText: this.extractedText // Include full text for analysis
    };
  }

  private findAllSections(): string[] {
    const text = this.extractedText.toLowerCase();
    const sections = [];

    const sectionKeywords = [
      'statement of net position',
      'balance sheet',
      'statement of revenues',
      'statement of activities',
      'notes to financial statements',
      'required supplementary information'
    ];

    for (const keyword of sectionKeywords) {
      if (text.includes(keyword)) {
        sections.push(keyword);
      }
    }

    return sections;
  }

  private findCommonPatterns(): string[] {
    const patterns = [];
    const text = this.extractedText;

    // Look for dollar amounts
    const dollarMatches = text.match(/\$[\d,]+/g);
    if (dollarMatches) {
      patterns.push(`Found ${dollarMatches.length} dollar amounts`);
    }

    // Look for large numbers (potential financial figures)
    const largeNumbers = text.match(/[\d,]{7,}/g);
    if (largeNumbers) {
      patterns.push(`Found ${largeNumbers.length} large numbers (7+ digits)`);
    }

    return patterns;
  }

  // Method to export debug data as JSON to a specific location
  exportDebugData(): void {
    const debugData = this.getDebugInfo();
    const jsonString = JSON.stringify(debugData, null, 2);

    // Create a more organized filename with district name if available
    const districtName = this.parsingResults?.districtName || 'unknown_district';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `debug_${districtName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.debugLog(`📁 Debug data exported: ${filename}`);

    // Also save to localStorage for easy access
    this.saveDebugToLocalStorage(debugData, filename);
  }

  // Save debug data to localStorage for easy access
  private saveDebugToLocalStorage(debugData: any, filename: string): void {
    try {
      const debugHistory = JSON.parse(localStorage.getItem('pdfParserDebugHistory') || '[]');

      // Add new debug session
      debugHistory.unshift({
        filename,
        timestamp: new Date().toISOString(),
        districtName: debugData.parsingResults?.districtName || 'Unknown',
        textLength: debugData.extractedTextLength,
        sectionsFound: debugData.sectionsFound.length,
        data: debugData
      });

      // Keep only last 10 debug sessions
      if (debugHistory.length > 10) {
        debugHistory.splice(10);
      }

      localStorage.setItem('pdfParserDebugHistory', JSON.stringify(debugHistory));
      this.debugLog('💾 Debug data also saved to browser storage');
    } catch (error) {
      this.debugLog(`⚠️ Could not save to localStorage: ${error}`);
    }
  }



  // Method to copy debug data to clipboard
  async copyDebugToClipboard(): Promise<void> {
    const debugData = this.getDebugInfo();
    const jsonString = JSON.stringify(debugData, null, 2);

    try {
      await navigator.clipboard.writeText(jsonString);
      this.debugLog('📋 Debug data copied to clipboard');
    } catch (error) {
      this.debugLog(`❌ Failed to copy to clipboard: ${error}`);
    }
  }

  // Get debug history from localStorage
  static getDebugHistory(): any[] {
    try {
      return JSON.parse(localStorage.getItem('pdfParserDebugHistory') || '[]');
    } catch (error) {
      console.error('Error loading debug history:', error);
      return [];
    }
  }

  // Clear debug history
  static clearDebugHistory(): void {
    localStorage.removeItem('pdfParserDebugHistory');
  }

  // Export specific debug session from history
  static exportDebugFromHistory(index: number): void {
    const history = this.getDebugHistory();
    if (history[index]) {
      const session = history[index];
      const jsonString = JSON.stringify(session.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = session.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  // Method to export data as JSON
  exportToJSON(data: ExtractedFinancialData): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.districtName || 'audit'}_financial_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}