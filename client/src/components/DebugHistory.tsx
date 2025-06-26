import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuditPDFParser } from '@/utils/pdfParser';

interface DebugSession {
  filename: string;
  timestamp: string;
  districtName: string;
  textLength: number;
  sectionsFound: number;
  data: any;
}

export default function DebugHistory() {
  const [debugHistory, setDebugHistory] = useState<DebugSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<DebugSession | null>(null);

  useEffect(() => {
    loadDebugHistory();
  }, []);

  const loadDebugHistory = () => {
    const history = AuditPDFParser.getDebugHistory();
    setDebugHistory(history);
  };

  const handleExportSession = (index: number) => {
    AuditPDFParser.exportDebugFromHistory(index);
  };

  const handleClearHistory = () => {
    AuditPDFParser.clearDebugHistory();
    setDebugHistory([]);
    setSelectedSession(null);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatFileSize = (length: number) => {
    return `${(length / 1024).toFixed(1)}KB`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>PDF Parser Debug History</CardTitle>
            <div className="flex gap-2">
              <Button onClick={loadDebugHistory} variant="outline" size="sm">
                <i className="fas fa-refresh mr-2"></i>
                Refresh
              </Button>
              <Button 
                onClick={handleClearHistory} 
                variant="outline" 
                size="sm"
                disabled={debugHistory.length === 0}
              >
                <i className="fas fa-trash mr-2"></i>
                Clear History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {debugHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-history text-4xl mb-4"></i>
              <p>No debug sessions found</p>
              <p className="text-sm">Upload and parse a PDF to generate debug data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {debugHistory.map((session, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{session.districtName}</h3>
                        <Badge variant="secondary">
                          {session.sectionsFound} sections
                        </Badge>
                        <Badge variant="outline">
                          {formatFileSize(session.textLength)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(session.timestamp)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {session.filename}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportSession(index);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <i className="fas fa-download mr-2"></i>
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">District</p>
                  <p className="text-sm text-muted-foreground">{selectedSession.districtName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Text Length</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(selectedSession.textLength)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Sections Found</p>
                  <p className="text-sm text-muted-foreground">{selectedSession.sectionsFound}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Timestamp</p>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedSession.timestamp)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Sections Detected:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.data.sectionsFound.map((section: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {section}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Debug Logs Preview:</p>
                <div className="bg-muted rounded-lg p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs">
                    {selectedSession.data.debugLogs.slice(0, 10).join('\n')}
                    {selectedSession.data.debugLogs.length > 10 && '\n... (more logs in exported file)'}
                  </pre>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Parsing Results:</p>
                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs">
                    {JSON.stringify(selectedSession.data.parsingResults, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
