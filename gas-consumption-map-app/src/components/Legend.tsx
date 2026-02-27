import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getColorForConsumption } from "@/utils/dataUtils";

interface LegendProps {
  min: number;
  max: number;
}

export function Legend({ min, max }: LegendProps) {
  const steps = 5;
  const stepSize = (max - min) / steps;

  const items = [];
  for (let i = 0; i <= steps; i++) {
    const value = min + stepSize * i;
    items.push({
      value: Math.round(value),
      color: getColorForConsumption(value, min, max),
    });
  }

  return (
    <Card className="p-3 gap-2">
      <CardHeader className="p-0">
        <CardTitle className="text-xs">Gas Consumption (m³/dwelling/year)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-1">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-5 h-3.5 rounded-sm border border-gray-400"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
