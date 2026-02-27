import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TooltipData {
  name: string;
  consumption: number | null;
  nationalAverage: number;
  yearOverYearChange: number | null;
  rank: number;
  totalMunicipalities: number;
  sparklineData: { year: number; value: number }[];
  color: string;
}

interface MunicipalityInfoProps {
  data: TooltipData;
  year: number;
}

export function MunicipalityInfo({ data, year }: MunicipalityInfoProps) {
  const {
    name,
    consumption,
    nationalAverage,
    yearOverYearChange,
    rank,
    totalMunicipalities,
    sparklineData,
    color,
  } = data;

  if (consumption === null) {
    return (
      <Card className="p-3 gap-2 min-w-56">
        <CardHeader className="p-0">
          <CardTitle className="text-sm">{name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground">No data available for {year}</p>
        </CardContent>
      </Card>
    );
  }

  const diffFromAverage = consumption - nationalAverage;
  const diffFromAveragePercent = ((diffFromAverage / nationalAverage) * 100).toFixed(1);
  const isAboveAverage = diffFromAverage > 0;
  const isBelowAverage = diffFromAverage < 0;

  const YoYIcon = yearOverYearChange === null
    ? Minus
    : yearOverYearChange < 0
      ? TrendingDown
      : yearOverYearChange > 0
        ? TrendingUp
        : Minus;

  const yoyColor = yearOverYearChange === null
    ? "text-muted-foreground"
    : yearOverYearChange < 0
      ? "text-green-600"
      : yearOverYearChange > 0
        ? "text-red-600"
        : "text-muted-foreground";

  return (
    <Card className="p-4 gap-3 min-w-64 shadow-lg">
      {/* Header with color indicator */}
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <CardTitle className="text-base leading-tight">{name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {/* Main consumption value */}
        <div>
          <div className="text-2xl font-bold">
            {consumption.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">m³</span>
          </div>
          <div className="text-xs text-muted-foreground">per dwelling ({year})</div>
        </div>

        {/* Sparkline */}
        {sparklineData.length > 1 && (
          <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={["dataMin - 50", "dataMax + 50"]} hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6b7280"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
              <span>{sparklineData[0]?.year}</span>
              <span>{sparklineData[sparklineData.length - 1]?.year}</span>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {/* National comparison */}
          <div className="bg-slate-50 rounded px-2 py-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">vs Average</div>
            <div className={`font-medium ${isBelowAverage ? "text-green-600" : isAboveAverage ? "text-red-600" : ""}`}>
              {isAboveAverage ? "+" : ""}{diffFromAveragePercent}%
            </div>
          </div>

          {/* Year-over-year change */}
          <div className="bg-slate-50 rounded px-2 py-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">vs {year - 1}</div>
            <div className={`font-medium flex items-center gap-1 ${yoyColor}`}>
              <YoYIcon className="w-3 h-3" />
              {yearOverYearChange !== null ? (
                <span>{yearOverYearChange > 0 ? "+" : ""}{yearOverYearChange.toFixed(1)}%</span>
              ) : (
                <span>N/A</span>
              )}
            </div>
          </div>

          {/* Ranking */}
          <div className="bg-slate-50 rounded px-2 py-1.5 col-span-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Ranking (lowest = best)</div>
            <div className="font-medium">
              #{rank} <span className="text-muted-foreground font-normal">of {totalMunicipalities}</span>
            </div>
          </div>
        </div>

        {/* Click hint */}
        <div className="text-[10px] text-muted-foreground text-center pt-1 border-t border-slate-100">
          Click for details
        </div>
      </CardContent>
    </Card>
  );
}
