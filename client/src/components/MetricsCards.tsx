import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardMetrics } from "@/types";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Outstanding Debt",
      value: `$${metrics?.totalDebt.toFixed(1)}B`,
      change: "+2.3% from last year",
      changeType: "positive",
      icon: "fa-money-bill-wave",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Issuers",
      value: metrics?.activeIssuers.toLocaleString(),
      change: "Unchanged",
      changeType: "neutral",
      icon: "fa-building",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Avg Credit Rating",
      value: metrics?.avgRating,
      change: "Stable outlook",
      changeType: "positive",
      icon: "fa-star",
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "YTD Issuances",
      value: `$${metrics?.ytdIssuances.toFixed(1)}B`,
      change: "12% below 2023",
      changeType: "negative",
      icon: "fa-chart-line",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                <p className={`text-sm mt-1 ${
                  card.changeType === "positive" ? "text-green-600" :
                  card.changeType === "negative" ? "text-orange-600" :
                  "text-muted-foreground"
                }`}>
                  <i className={`fas ${
                    card.changeType === "positive" ? "fa-arrow-up" :
                    card.changeType === "negative" ? "fa-arrow-down" :
                    "fa-minus"
                  } mr-1`}></i>
                  {card.change}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <i className={`fas ${card.icon} ${card.iconColor} text-xl`}></i>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
