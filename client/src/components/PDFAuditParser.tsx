import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuditPDFParser } from "@/utils/pdfParser";
import { ReportStorage } from "@/utils/reportStorage";
import { ExtractedFinancialData } from "@/types";
import ManualEntryForm from "./ManualEntryForm";
import PreviousReports from "./PreviousReports";
import DebugPanel from "./DebugPanel";
import SettingsModal from "./SettingsModal";

interface DebugInfo {
  rawText: string;
  sectionMatches: { section: string; found: boolean; position?: number }[];
  regexMatches: { pattern: string; matches: string[] }[];
  errors: string[];
}

export default function PDFAuditParser() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedFinancialData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [compactJSON, setCompactJSON] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parser = new AuditPDFParser();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 50MB.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setExtractedData(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const data = await parser.parsePDF(selectedFile);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setExtractedData(data);

      // Save report to localStorage
      ReportStorage.saveReport(selectedFile.name, data);

      // Create debug information (mock for now - would be enhanced in real parser)
      const mockDebugInfo: DebugInfo = {
        rawText: `Sample PDF text for ${selectedFile.name}...`,
        sectionMatches: [
          { section: 'Statement of Net Position', found: true, position: 145 },
          { section: 'Statement of Activities', found: true, position: 2341 },
          { section: 'Fund Balance Sheet', found: true, position: 4523 },
          { section: 'Statement of Revenues', found: true, position: 6234 }
        ],
        regexMatches: [
          { pattern: '/total assets.*?\\$([\\d,]+)/i', matches: [data.netPosition.totalAssets.toString()] },
          { pattern: '/total liabilities.*?\\$([\\d,]+)/i', matches: [data.netPosition.totalLiabilities.toString()] }
        ],
        errors: []
      };
      setDebugInfo(mockDebugInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the PDF.');
      const errorDebugInfo: DebugInfo = {
        rawText: '',
        sectionMatches: [],
        regexMatches: [],
        errors: [err instanceof Error ? err.message : 'Unknown error']
      };
      setDebugInfo(errorDebugInfo);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleExportJSON = () => {
    if (extractedData) {
      parser.exportToJSON(extractedData);
    }
  };

  const handleExportCSV = () => {
    if (extractedData) {
      ReportStorage.exportCSV(extractedData);
    }
  };

  const handleReportLoad = (data: ExtractedFinancialData) => {
    setExtractedData(data);
    setSelectedFile(null);
    setError(null);
  };

  const handleExportDebug = () => {
    parser.exportDebugData();
  };

  const handleCopyDebug = async () => {
    await parser.copyDebugToClipboard();
  };

  const handleSendDebug = async () => {
    // You can replace this URL with your own webhook
    await parser.sendDebugData('https://webhook.site/your-unique-url');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Previous Reports Section */}
        <PreviousReports onReportLoad={handleReportLoad} />

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-file-pdf text-red-500"></i>
                  Texas ISD Audit PDF Parser
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload a Texas Independent School District audit PDF to extract key financial data
                </p>
              </div>
              <SettingsModal 
                compactJSON={compactJSON} 
                onCompactJSONChange={setCompactJSON}
              />
            </div>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="pdf-upload" className="text-sm font-medium">
              Select PDF File
            </label>
            <Input
              ref={fileInputRef}
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <i className="fas fa-file-pdf mr-1"></i>
                {selectedFile.name}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                <span className="text-sm">Processing PDF...</span>
              </div>
              <Progress value={processingProgress} className="w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isProcessing}
              className="flex items-center gap-2"
            >
              <i className="fas fa-upload"></i>
              {isProcessing ? 'Processing...' : 'Extract Financial Data'}
            </Button>
            
            {(selectedFile || extractedData) && (
              <Button variant="outline" onClick={resetForm}>
                <i className="fas fa-redo mr-2"></i>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {extractedData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Extracted Financial Data</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleExportJSON} variant="outline" size="sm">
                  <i className="fas fa-download mr-2"></i>
                  Export JSON
                </Button>
                <Button onClick={handleExportCSV} variant="outline" size="sm">
                  <i className="fas fa-file-csv mr-2"></i>
                  Export CSV
                </Button>
                <Button onClick={handleExportDebug} variant="outline" size="sm" title="Export debug data for analysis">
                  <i className="fas fa-bug mr-2"></i>
                  Debug Data
                </Button>
                <Button onClick={handleCopyDebug} variant="outline" size="sm" title="Copy debug data to clipboard">
                  <i className="fas fa-copy mr-2"></i>
                  Copy Debug
                </Button>
              </div>
            </div>
            {extractedData.districtName && (
              <p className="text-sm text-muted-foreground">
                {extractedData.districtName} - Fiscal Year {extractedData.fiscalYear || 'Unknown'}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Net Position */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <i className="fas fa-balance-scale text-blue-500"></i>
                  Net Position
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Assets:</span>
                    <span className="font-medium">{formatCurrency(extractedData.netPosition.totalAssets)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Liabilities:</span>
                    <span className="font-medium">{formatCurrency(extractedData.netPosition.totalLiabilities)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Net Position:</span>
                    <span className="font-bold">{formatCurrency(extractedData.netPosition.netPosition)}</span>
                  </div>
                </div>
              </div>

              {/* Fund Balance */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <i className="fas fa-piggy-bank text-green-500"></i>
                  Fund Balance
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">General Fund:</span>
                    <span className="font-medium">{formatCurrency(extractedData.fundBalance.generalFund)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Debt Service Fund:</span>
                    <span className="font-medium">{formatCurrency(extractedData.fundBalance.debtServiceFund)}</span>
                  </div>
                </div>
              </div>

              {/* Revenues */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <i className="fas fa-chart-line text-purple-500"></i>
                  Revenues by Source
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Local Sources:</span>
                    <span className="font-medium">{formatCurrency(extractedData.revenues.local)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">State Sources:</span>
                    <span className="font-medium">{formatCurrency(extractedData.revenues.state)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Federal Sources:</span>
                    <span className="font-medium">{formatCurrency(extractedData.revenues.federal)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Revenue:</span>
                    <span className="font-bold">
                      {formatCurrency(
                        extractedData.revenues.local + 
                        extractedData.revenues.state + 
                        extractedData.revenues.federal
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expenditures */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <i className="fas fa-receipt text-orange-500"></i>
                  Expenditures by Function
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Instruction:</span>
                    <span className="font-medium">{formatCurrency(extractedData.expenditures.instruction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Administration:</span>
                    <span className="font-medium">{formatCurrency(extractedData.expenditures.admin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Debt Service:</span>
                    <span className="font-medium">{formatCurrency(extractedData.expenditures.debtService)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Expenditures:</span>
                    <span className="font-bold">
                      {formatCurrency(
                        extractedData.expenditures.instruction + 
                        extractedData.expenditures.admin + 
                        extractedData.expenditures.debtService
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw JSON Preview */}
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold">JSON Preview</h3>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(extractedData, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Entry Form */}
      {extractedData && (
        <ManualEntryForm 
          initialData={extractedData} 
          onDataChange={setExtractedData}
        />
      )}

      {/* Debug Panel */}
      <DebugPanel debugInfo={debugInfo} />
    </div>
    </TooltipProvider>
  );
}