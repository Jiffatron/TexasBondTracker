import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Municipality } from "@shared/schema";

interface TexasMapProps {
  mapView: "debt" | "rating" | "perCapita";
  onMapViewChange: (view: "debt" | "rating" | "perCapita") => void;
  municipalities: Municipality[];
}

export default function TexasMap({ mapView, onMapViewChange, municipalities }: TexasMapProps) {
  return (
    <Card>
      <CardHeader>
        <div className="text-center mb-4">
          <CardTitle>Texas Municipal Bond Map</CardTitle>
        </div>
        <div className="flex items-center justify-center space-x-2">
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
      </CardHeader>

      <CardContent>
        {/* Interactive Map Display */}
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

          {/* Dynamic Hotspots based on mock data */}
          {municipalities.map((m) => (
            <div
              key={m.id}
              className={`absolute w-3 h-3 rounded-full animate-pulse-soft cursor-pointer ${getColorByMetric(m, mapView)}`}
              style={{
                top: getTopByCounty(m.county),
                left: getLeftByCounty(m.county),
              }}
              title={`${m.name} - ${getMetricLabel(m, mapView)}`}
            />
          ))}
        </div>

        {/* Map Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --------- Helper Functions ---------

function getColorByMetric(m: Municipality, mapView: TexasMapProps["mapView"]) {
  if (mapView === "debt") {
    const debt = parseFloat(m.outstandingDebt);
    if (debt > 500_000_000) return "bg-red-500";
    if (debt > 50_000_000) return "bg-yellow-500";
    return "bg-green-500";
  }

  if (mapView === "rating") {
    if (!m.creditRating) return "bg-gray-500";
    const rating = m.creditRating.toUpperCase();
    if (rating.startsWith("AAA")) return "bg-green-500";
    if (rating.startsWith("A")) return "bg-yellow-500";
    return "bg-red-500";
  }

  if (mapView === "perCapita") {
    if (!m.perCapitaDebt) return "bg-gray-500";
    const perCap = parseFloat(m.perCapitaDebt);
    if (perCap > 4000) return "bg-red-500";
    if (perCap > 2000) return "bg-yellow-500";
    return "bg-green-500";
  }

  return "bg-gray-500";
}

function getMetricLabel(m: Municipality, mapView: TexasMapProps["mapView"]) {
  if (mapView === "debt") return `$${Number(m.outstandingDebt).toLocaleString()}`;
  if (mapView === "rating") return `Rated ${m.creditRating}`;
  if (mapView === "perCapita") return `$${Number(m.perCapitaDebt).toLocaleString()} per capita`;
  return "";
}

// Fake position logic — replace with real map coords later
function getTopByCounty(county: string) {
  const positions: Record<string, string> = {
    "Harris County": "64px",
    "Travis County": "128px",
    "Dallas County": "80px",
    "Bexar County": "200px",
  };
  return positions[county] || "100px";
}

function getLeftByCounty(county: string) {
  const positions: Record<string, string> = {
    "Harris County": "320px",
    "Travis County": "180px",
    "Dallas County": "100px",
    "Bexar County": "140px",
  };
  return positions[county] || "160px";
}
