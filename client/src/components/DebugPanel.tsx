import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DebugInfo {
  rawText: string;
  sectionMatches: { section: string; found: boolean; position?: number }[];
  regexMatches: { pattern: string; matches: string[] }[];
  errors: string[];
}

interface DebugPanelProps {
  debugInfo: DebugInfo | null;
}

export default function DebugPanel({ debugInfo }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          title="Open Debug Panel"
        >
          🐞
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-hidden">
      <Card className="shadow-2xl border-orange-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              🐞 Debug Panel
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {!debugInfo ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No debug information available. Process a PDF to see debug data.
            </div>
          ) : (
            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-3 text-xs">
                <TabsTrigger value="sections" className="text-xs">Sections</TabsTrigger>
                <TabsTrigger value="regex" className="text-xs">Matches</TabsTrigger>
                <TabsTrigger value="text" className="text-xs">Raw Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sections" className="mt-2">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h4 className="text-xs font-medium">Section Detection:</h4>
                  {debugInfo.sectionMatches.map((match, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="truncate">{match.section}</span>
                      <Badge 
                        variant={match.found ? "default" : "secondary"}
                        className="text-xs h-5"
                      >
                        {match.found ? "✅ Found" : "❌ Missing"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="regex" className="mt-2">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h4 className="text-xs font-medium">Pattern Matches:</h4>
                  {debugInfo.regexMatches.map((match, index) => (
                    <div key={index} className="text-xs">
                      <div className="font-mono text-xs text-muted-foreground mb-1">
                        {match.pattern}
                      </div>
                      <div className="ml-2">
                        {match.matches.length > 0 ? (
                          match.matches.map((m, i) => (
                            <div key={i} className="text-green-600 font-mono">
                              "{m}"
                            </div>
                          ))
                        ) : (
                          <div className="text-red-500">No matches</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="mt-2">
                <div className="max-h-64 overflow-y-auto">
                  <h4 className="text-xs font-medium mb-2">Raw PDF Text (first 2000 chars):</h4>
                  <div className="bg-muted p-2 rounded text-xs font-mono whitespace-pre-wrap">
                    {debugInfo.rawText.substring(0, 2000)}
                    {debugInfo.rawText.length > 2000 && "\n... (truncated)"}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {debugInfo?.errors && debugInfo.errors.length > 0 && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <h4 className="font-medium text-red-800 mb-1">Errors:</h4>
              {debugInfo.errors.map((error, index) => (
                <div key={index} className="text-red-600">{error}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}