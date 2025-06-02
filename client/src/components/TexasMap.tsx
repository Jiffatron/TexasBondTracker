import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TexasMapProps {
  mapView: "debt" | "rating" | "perCapita";
  onMapViewChange: (view: "debt" | "rating" | "perCapita") => void;
}

export default function TexasMap({ mapView, onMapViewChange }: TexasMapProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Texas Municipal Bond Map</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={mapView === "debt" ? "default" : "outline"}
              size="sm"
              onClick={() => onMapViewChange("debt")}
            >
              Debt Amount
            </Button>
            <Button
              variant={mapView === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => onMapViewChange("rating")}
            >
              Credit Rating
            </Button>
            <Button
              variant={mapView === "perCapita" ? "default" : "outline"}
              size="sm"
              onClick={() => onMapViewChange("perCapita")}
            >
              Per Capita
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-border">
          <div className="text-center">
            <i className="fas fa-map text-4xl text-primary mb-4"></i>
            <p className="text-lg font-medium text-foreground">Interactive Texas Map</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click counties to view municipal bond data
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Currently showing: {mapView === "debt" ? "Outstanding Debt" : mapView === "rating" ? "Credit Ratings" : "Per Capita Debt"}
            </p>
          </div>
          
          {/* Mock hotspots for major metropolitan areas */}
          <div
            className="absolute top-16 right-24 w-4 h-4 bg-red-500 rounded-full animate-pulse-soft cursor-pointer"
            title="Harris County - High Debt"
          ></div>
          <div
            className="absolute top-20 left-32 w-3 h-3 bg-yellow-500 rounded-full animate-pulse-soft cursor-pointer"
            title="Dallas County"
          ></div>
          <div
            className="absolute bottom-24 left-28 w-3 h-3 bg-green-500 rounded-full animate-pulse-soft cursor-pointer"
            title="Bexar County"
          ></div>
          <div
            className="absolute top-32 left-44 w-2 h-2 bg-primary rounded-full animate-pulse-soft cursor-pointer"
            title="Travis County"
          ></div>
        </div>
        
        {/* Map Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>Low Debt (&lt;$50M)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Medium Debt ($50M - $500M)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>High Debt (&gt;$500M)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
