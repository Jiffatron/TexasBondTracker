import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedFinancialData } from '@/types';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class AuditPDFParser {
  private extractedText: string = '';

  async parsePDF(file: File): Promise<ExtractedFinancialData> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      this.extractedText = fullText;
      
      return this.extractFinancialData();
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
    // Look for Statement of Net Position section
    const netPositionSection = this.findSection(text, [
      'statement of net position',
      'government-wide statement of net position',
      'net position'
    ]);

    return {
      totalAssets: this.extractAmount(netPositionSection, [
        'total assets',
        'total current assets',
        'assets'
      ]),
      totalLiabilities: this.extractAmount(netPositionSection, [
        'total liabilities',
        'total current liabilities',
        'liabilities'
      ]),
      netPosition: this.extractAmount(netPositionSection, [
        'net position',
        'total net position',
        'net assets'
      ])
    };
  }

  private extractFundBalance(text: string): ExtractedFinancialData['fundBalance'] {
    const balanceSection = this.findSection(text, [
      'balance sheet',
      'governmental funds balance sheet',
      'fund balance'
    ]);

    return {
      generalFund: this.extractAmount(balanceSection, [
        'general fund',
        'fund balance - general fund'
      ]),
      debtServiceFund: this.extractAmount(balanceSection, [
        'debt service fund',
        'fund balance - debt service'
      ])
    };
  }

  private extractRevenues(text: string): ExtractedFinancialData['revenues'] {
    const revenueSection = this.findSection(text, [
      'revenues',
      'statement of revenues',
      'revenues by source'
    ]);

    return {
      local: this.extractAmount(revenueSection, [
        'local sources',
        'local revenue',
        'property taxes',
        'local and intermediate sources'
      ]),
      state: this.extractAmount(revenueSection, [
        'state sources',
        'state revenue',
        'state programs'
      ]),
      federal: this.extractAmount(revenueSection, [
        'federal sources',
        'federal revenue',
        'federal programs'
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
    for (const keyword of keywords) {
      const index = text.indexOf(keyword);
      if (index !== -1) {
        // Return the next 5000 characters from the found keyword
        return text.substring(index, index + 5000);
      }
    }
    return text; // Return full text if no section found
  }

  private extractAmount(text: string, keywords: string[]): number {
    for (const keyword of keywords) {
      const pattern = new RegExp(
        keyword + '[\\s\\$,\\(\\)]*([\\d,]+)',
        'i'
      );
      const match = text.match(pattern);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        const parsed = parseInt(amount, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }
    return 0;
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