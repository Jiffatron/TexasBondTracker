import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function RatingDistribution() {
  const { data: distribution = {}, isLoading } = useQuery({
    queryKey: ["/api/dashboard/rating-distribution"],
  });

  // Transform the data for display
  const ratingData = [
    { rating: "AAA", count: distribution["AAA"] || 0, color: "bg-green-500" },
    { rating: "AA+/AA/AA-", count: (distribution["AA+"] || 0) + (distribution["AA"] || 0) + (distribution["AA-"] || 0), color: "bg-blue-500" },
    { rating: "A+/A/A-", count: (distribution["A+"] || 0) + (distribution["A"] || 0) + (distribution["A-"] || 0), color: "bg-yellow-500" },
    { rating: "BBB & Below", count: (distribution["BBB"] || 0) + (distribution["BB"] || 0) + (distribution["B"] || 0), color: "bg-red-500" },
  ];

  const totalCount = ratingData.reduce((sum, item) => sum + item.count, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ratingData.map((item) => {
            const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
            
            return (
              <div key={item.rating}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
