// client/src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricsCards from "@/components/MetricsCards";
import TexasMap from "@/components/TexasMap";
import IssuersTable from "@/components/IssuersTable";
import TrendsChart from "@/components/TrendsChart";
import RatingDistribution from "@/components/RatingDistribution";
import RecentActivity from "@/components/RecentActivity";
import BondSearch from "@/components/BondSearch";
import { Municipality } from "@shared/schema";
import { FilterState } from "@/types";

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    entityTypes: ["school_district", "city"],
    creditRatings: [],
    region: "",
    minDebt: 0,
    maxDebt: 1_000_000_000,
  });

  const [mapView, setMapView] = useState<"debt" | "rating" | "perCapita">("debt");
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  // Vite will replace BASE_URL with "/" in dev, or "/TexasBondTracker/" in prod
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const loadData = async () => {
      try {
        const mRes = await fetch(`${base}data/municipalities.json`);

        if (!mRes.ok) {
          console.error("Data load error", {
            muni: mRes.status,
          });
          return;
        }

        setMunicipalities(await mRes.json());
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    loadData();
  }, [base]);

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={setFilters} />
        <main className="flex-1 overflow-auto">
          <div className="bg-white dark:bg-gray-900 border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Texas Municipal Bond Dashboard
                </h2>
                <p className="text-muted-foreground mt-1">
                  Comprehensive financial transparency for Texas municipalities
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                  <i className="fas fa-download mr-2"></i>Export Data
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <i className="fas fa-plus mr-2"></i>Create Alert
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <MetricsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2 space-y-6">
                <TexasMap
                  mapView={mapView}
                  onMapViewChange={setMapView}
                  municipalities={municipalities}
                />
                <IssuersTable filters={filters} />
              </div>
              <div className="space-y-6">
                <TrendsChart />
                <RatingDistribution />
                <RecentActivity />
              </div>
            </div>

            <div className="mt-8">
              <BondSearch />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
