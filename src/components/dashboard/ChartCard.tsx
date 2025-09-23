import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const temperatureData = [
  { month: "Jan", temp: 18.2, depth: 50 },
  { month: "Feb", temp: 19.1, depth: 50 },
  { month: "Mar", temp: 20.8, depth: 50 },
  { month: "Apr", temp: 22.3, depth: 50 },
  { month: "May", temp: 24.1, depth: 50 },
  { month: "Jun", temp: 25.7, depth: 50 },
  { month: "Jul", temp: 26.9, depth: 50 },
  { month: "Aug", temp: 26.5, depth: 50 },
  { month: "Sep", temp: 25.1, depth: 50 },
  { month: "Oct", temp: 23.2, depth: 50 },
  { month: "Nov", temp: 21.0, depth: 50 },
  { month: "Dec", temp: 19.3, depth: 50 },
];

export function ChartCard() {
  return (
    <Card className="card-ocean">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500"></div>
          <span>Temperature Trends</span>
        </CardTitle>
        <CardDescription>
          Surface temperature data from ARGO floats in the Indian Ocean
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value, name) => [`${value}°C`, 'Temperature']}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="url(#tempGradient)"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}