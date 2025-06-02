import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReportStorage, StoredReport } from "@/utils/reportStorage";
import { ExtractedFinancialData } from "@/types";

interface PreviousReportsProps {
  onReportLoad: (data: ExtractedFinancialData) => void;
}

export default function PreviousReports({ onReportLoad }: PreviousReportsProps) {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const savedReports = ReportStorage.getReportsList();
    setReports(savedReports);
  };

  const handleLoadReport = (filename: string) => {
    const report = ReportStorage.getReport(filename);
    if (report) {
      onReportLoad(report.data);
      setSelectedReport(filename);
    }
  };

  const handleDeleteReport = (filename: string) => {
    ReportStorage.deleteReport(filename);
    loadReports();
    setShowConfirmDelete(null);
    if (selectedReport === filename) {
      setSelectedReport("");
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-history"></i>
          Previous Reports ({reports.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <i className="fas fa-inbox text-2xl mb-2 block"></i>
            No saved reports yet. Upload and parse a PDF to save your first report.
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Load Previous Report</label>
              <Select value={selectedReport} onValueChange={handleLoadReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a report to load..." />
                </SelectTrigger>
                <SelectContent>
                  {reports.map((report) => (
                    <SelectItem key={report.filename} value={report.filename}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{report.filename}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDate(report.timestamp)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReport && (
              <div className="space-y-4">
                {(() => {
                  const report = reports.find(r => r.filename === selectedReport);
                  if (!report) return null;
                  
                  return (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{report.data.districtName || 'Unknown District'}</h4>
                          <p className="text-sm text-muted-foreground">
                            FY {report.data.fiscalYear || 'Unknown'} • Saved {formatDate(report.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            <i className="fas fa-file-pdf mr-1"></i>
                            Parsed
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowConfirmDelete(selectedReport)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Net Position:</span>
                          <p className="font-medium">{formatCurrency(report.data.netPosition.netPosition)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Revenue:</span>
                          <p className="font-medium">
                            {formatCurrency(
                              report.data.revenues.local + 
                              report.data.revenues.state + 
                              report.data.revenues.federal
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Instruction:</span>
                          <p className="font-medium">{formatCurrency(report.data.expenditures.instruction)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">General Fund:</span>
                          <p className="font-medium">{formatCurrency(report.data.fundBalance.generalFund)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {showConfirmDelete && (
              <Alert variant="destructive">
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>Delete "{showConfirmDelete}"? This cannot be undone.</span>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReport(showConfirmDelete)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowConfirmDelete(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}