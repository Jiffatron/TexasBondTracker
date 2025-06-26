import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IssuanceActivity } from "@shared/schema";
import { useJsonData } from "@/hooks/useAutoRefresh";

export default function RecentActivity() {
  const base = import.meta.env.BASE_URL;
  const { data: activities, isLoading } = useJsonData<IssuanceActivity>(`${base}data/activities.json`);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "issuance":
        return "w-2 h-2 rounded-full bg-green-500";
      case "rating_change":
        return "w-2 h-2 rounded-full bg-yellow-500";
      case "filing":
        return "w-2 h-2 rounded-full bg-blue-500";
      default:
        return "w-2 h-2 rounded-full bg-gray-500";
    }
  };

  const formatTimeAgo = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return "Less than an hour ago";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gray-200 mt-2"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
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
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${getActivityIcon(activity.activityType)} mt-2`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                {activity.description && (
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4 text-sm">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
