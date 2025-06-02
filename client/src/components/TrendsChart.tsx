import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TrendsChart() {
  // Mock data for monthly issuance trends
  const monthlyData = [
    { month: "Jan", amount: 2.1, count: 15 },
    { month: "Feb", amount: 1.8, count: 12 },
    { month: "Mar", amount: 3.2, count: 22 },
    { month: "Apr", amount: 2.5, count: 18 },
    { month: "May", amount: 1.9, count: 14 },
    { month: "Jun", amount: 2.7, count: 19 },
    { month: "Jul", amount: 2.3, count: 16 },
    { month: "Aug", amount: 1.6, count: 11 },
    { month: "Sep", amount: 2.9, count: 21 },
    { month: "Oct", amount: 2.4, count: 17 },
    { month: "Nov", amount: 2.0, count: 13 },
    { month: "Dec", amount: 1.7, count: 10 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issuance Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Monthly bond issuances (2024)</p>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}B`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}B`, "Amount"]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Peak Month:</span>
            <span className="font-medium">March ($3.2B)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg/Month:</span>
            <span className="font-medium">$2.3B</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
