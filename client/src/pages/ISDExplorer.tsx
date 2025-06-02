import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ISDExplorer() {
  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">ISD Explorer</h1>
          <p className="text-muted-foreground mt-2">
            Explore manually entered JSON data and compare districts
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Data Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Upload JSON files with financial data or manually enter district information 
                for analysis and comparison.
              </p>
              <div className="space-y-2">
                <Button className="w-full" disabled>
                  <i className="fas fa-upload mr-2"></i>
                  Upload JSON Files (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <i className="fas fa-plus mr-2"></i>
                  Add District Manually (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>District Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Side-by-side comparison of financial metrics across multiple districts.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  <i className="fas fa-chart-bar mr-2"></i>
                  Compare Districts (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <i className="fas fa-table mr-2"></i>
                  View Comparison Table (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Features In Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Data Import</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• JSON file upload</li>
                  <li>• Manual data entry forms</li>
                  <li>• Data validation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Analysis Tools</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Financial ratio calculations</li>
                  <li>• Peer group comparisons</li>
                  <li>• Trend analysis</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Visualizations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Interactive charts</li>
                  <li>• Regional maps</li>
                  <li>• Export capabilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}