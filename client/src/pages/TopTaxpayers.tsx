import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TopTaxpayers() {
  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Top Taxpayers Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Analyze concentration risk and taxpayer distribution across Texas ISDs
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Taxpayer Concentration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Track the top 10 taxpayers for each district and analyze concentration risk.
              </p>
              <div className="space-y-2">
                <Button className="w-full" disabled>
                  <i className="fas fa-building mr-2"></i>
                  View Top Taxpayers (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <i className="fas fa-chart-pie mr-2"></i>
                  Concentration Analysis (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Identify districts with high concentration risk from major taxpayers.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Risk Dashboard (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <i className="fas fa-download mr-2"></i>
                  Export Risk Report (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Planned Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Data Sources</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Top 10 taxpayer lists from CAFRs</li>
                  <li>• Property valuation data</li>
                  <li>• Industry sector classification</li>
                  <li>• Historical concentration trends</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Analysis Tools</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Herfindahl-Hirschman Index calculation</li>
                  <li>• Industry diversification metrics</li>
                  <li>• Concentration risk scoring</li>
                  <li>• Peer comparison analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}