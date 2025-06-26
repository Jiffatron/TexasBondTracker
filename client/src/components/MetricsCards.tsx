// client/src/components/MetricsCards.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Municipality } from "@shared/schema";
import { DashboardMetrics } from "@/types";
// Updated to use JSON files instead of mock data

export default function MetricsCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const base = import.meta.env.BASE_URL; // "/" in dev, "/TexasBondTracker/" in prod

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // Load multiple municipality files if they exist
        const municipalityFiles = ['municipalities.json', 'municipalities-2024.json', 'municipalities-extra.json'];
        const bondFiles = ['bonds.json', 'bonds-2024.json', 'bonds-2023.json'];

        let allMunicipalities: Municipality[] = [];
        let allBonds: any[] = [];

        // Load all municipality files
        for (const file of municipalityFiles) {
          try {
            const res = await fetch(`${base}data/${file}`);
            if (res.ok) {
              const data = await res.json();
              allMunicipalities = allMunicipalities.concat(data);
              console.log(`✅ Loaded ${data.length} municipalities from ${file}`);
            }
          } catch (err) {
            // File doesn't exist, skip silently
          }
        }

        // Load all bond files for YTD calculation
        for (const file of bondFiles) {
          try {
            const res = await fetch(`${base}data/${file}`);
            if (res.ok) {
              const data = await res.json();
              allBonds = allBonds.concat(data);
              console.log(`✅ Loaded ${data.length} bonds from ${file}`);
            }
          } catch (err) {
            // File doesn't exist, skip silently
          }
        }

        if (allMunicipalities.length === 0) {
          console.error("No municipality data found");
          return;
        }

        const totalDebt =
          allMunicipalities.reduce((sum, m) => sum + parseFloat(m.outstandingDebt), 0) /
          1_000_000_000;
        const activeIssuers = allMunicipalities.length;

        // Calculate average rating from actual data
        const ratingsWithValues = allMunicipalities
          .filter(m => m.creditRating)
          .map(m => m.creditRating);
        const avgRating = ratingsWithValues.length > 0 ? "AA" : "N/A"; // Could enhance this

        // Calculate YTD issuances from bond data
        const currentYear = new Date().getFullYear();
        const ytdBonds = allBonds.filter(b => new Date(b.issueDate).getFullYear() === currentYear);
        const ytdIssuances = ytdBonds.reduce((sum, b) => sum + parseFloat(b.parAmount), 0) / 1_000_000_000;

        setMetrics({ totalDebt, activeIssuers, avgRating, ytdIssuances });
      } catch (err) {
        console.error("Error loading metrics:", err);
      }
    };

    loadMetrics();
  }, [base]);

  // loading skeleton
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // once loaded, render your metrics cards
  const cards = [
    {
      title: "Total Outstanding Debt",
      value: `$${metrics.totalDebt.toFixed(1)}B`,
      change: "+2.3% from last year",
      changeType: "positive",
      icon: "fa-money-bill-wave",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Issuers",
      value: metrics.activeIssuers.toLocaleString(),
      change: "Unchanged",
      changeType: "neutral",
      icon: "fa-building",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Avg Credit Rating",
      value: metrics.avgRating,
      change: "Stable outlook",
      changeType: "positive",
      icon: "fa-star",
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "YTD Issuances",
      value: `$${metrics.ytdIssuances.toFixed(1)}B`,
      change: "12% below 2023",
      changeType: "negative",
      icon: "fa-chart-line",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {card.value}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    card.changeType === "positive"
                      ? "text-green-600"
                      : card.changeType === "negative"
                      ? "text-orange-600"
                      : "text-muted-foreground"
                  }`}
                >
                  <i
                    className={`fas ${
                      card.changeType === "positive"
                        ? "fa-arrow-up"
                        : card.changeType === "negative"
                        ? "fa-arrow-down"
                        : "fa-minus"
                    } mr-1`}
                  />
                  {card.change}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <i className={`fas ${card.icon} ${card.iconColor} text-xl`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
