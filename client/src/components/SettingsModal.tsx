import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReportStorage } from "@/utils/reportStorage";

interface SettingsModalProps {
  compactJSON: boolean;
  onCompactJSONChange: (compact: boolean) => void;
}

export default function SettingsModal({ compactJSON, onCompactJSONChange }: SettingsModalProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClearAllReports = () => {
    ReportStorage.clearAllReports();
    setShowConfirmClear(false);
    // Optionally refresh the page or trigger a callback to update other components
    window.location.reload();
  };

  const resetToDefault = () => {
    onCompactJSONChange(false);
    localStorage.removeItem('settings');
  };

  const reportCount = ReportStorage.getReportsList().length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <i className="fas fa-cog mr-2"></i>
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="fas fa-cog"></i>
            Application Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* JSON Format Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">JSON Export Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-json" className="text-sm font-medium">
                    Compact JSON
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Export JSON in compact format (single line) instead of pretty-printed
                  </p>
                </div>
                <Switch
                  id="compact-json"
                  checked={compactJSON}
                  onCheckedChange={onCompactJSONChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Storage Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Storage Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="text-muted-foreground mb-2">
                  Stored Reports: <span className="font-medium">{reportCount}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Reports are saved locally in your browser storage and persist between sessions.
                </p>
              </div>

              {!showConfirmClear ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowConfirmClear(true)}
                  disabled={reportCount === 0}
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear All Stored Reports
                </Button>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="text-sm">
                        This will permanently delete all {reportCount} saved reports. This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleClearAllReports}
                        >
                          <i className="fas fa-trash mr-2"></i>
                          Yes, Delete All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowConfirmClear(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Reset Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Reset all application settings to their default values.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefault}
                >
                  <i className="fas fa-undo mr-2"></i>
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Texas ISD Audit Parser v1.0.0</span>
                </p>
                <p className="text-muted-foreground">
                  Client-side PDF parsing tool for extracting financial data from Texas Independent School District audit reports.
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                  <span>✓ GitHub Pages Compatible</span>
                  <span>✓ No Server Required</span>
                  <span>✓ Local Storage</span>
                </div>
                <p className="text-xs text-muted-foreground border-t pt-2">
                  Built with React + Vite | PDF.js | TypeScript
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}