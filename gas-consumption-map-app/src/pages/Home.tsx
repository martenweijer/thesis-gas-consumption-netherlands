import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, Map } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadGasConsumptionData } from "@/utils/dataUtils";
import type { GasConsumptionData } from "@/types";

interface YearlyAverage {
  year: number;
  average: number;
}

function calculateNationalAverages(data: GasConsumptionData): YearlyAverage[] {
  const yearlyTotals: { [year: number]: { sum: number; count: number } } = {};

  for (const record of data.data) {
    if (!yearlyTotals[record.year]) {
      yearlyTotals[record.year] = { sum: 0, count: 0 };
    }
    yearlyTotals[record.year].sum += record.gas_consumption;
    yearlyTotals[record.year].count += 1;
  }

  return Object.entries(yearlyTotals)
    .map(([year, { sum, count }]) => ({
      year: parseInt(year),
      average: Math.round(sum / count),
    }))
    .sort((a, b) => a.year - b.year);
}

export function Home() {
  const [data, setData] = useState<GasConsumptionData | null>(null);

  useEffect(() => {
    loadGasConsumptionData().then(setData);
  }, []);

  const yearlyAverages = useMemo(() => {
    if (!data) return [];
    return calculateNationalAverages(data);
  }, [data]);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-slate-800 text-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Master's Thesis · Data Science
          </p>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Predicting Residential Natural Gas Consumption in the Netherlands
          </h1>
          <p className="text-slate-300 text-lg mb-2 max-w-2xl">
            Can machine learning accurately predict how much gas Dutch municipalities consume?
            This thesis applies supervised learning to ~340 municipalities over 2015–2024 to find out.
          </p>
          <p className="text-slate-500 text-sm mt-6">
            Minnesota State University, Mankato
          </p>
        </div>
      </section>

      {/* Research Questions */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-800">Research Questions</h2>
          </div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Main question</p>
              <p className="text-slate-800 text-lg font-medium leading-relaxed">
                How accurately can machine learning models predict residential natural gas consumption at the municipal level in the Netherlands?
              </p>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {[
              "What socio-demographic, economic, and housing characteristics are most predictive of municipal-level residential natural gas consumption?",
              "Which machine learning algorithms perform best for this prediction task, and how do they compare to traditional statistical methods?",
              "How does model performance vary across different types of municipalities (urban vs. rural, high vs. low income)?",
            ].map((q, i) => (
              <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-400 font-semibold text-sm shrink-0 mt-0.5">SQ{i + 1}</span>
                <p className="text-slate-600 text-sm leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore the Data */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-800">Explore the Data</h2>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            The dataset used in this research covers all Dutch municipalities from 2015 to 2024.
            Use the interactive map to explore consumption patterns by year and municipality.
          </p>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>National Average Consumption Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {yearlyAverages.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-slate-400 text-sm">Loading...</div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={yearlyAverages}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "#64748b" }}
                        tickLine={{ stroke: "#94a3b8" }}
                      />
                      <YAxis
                        tick={{ fill: "#64748b" }}
                        tickLine={{ stroke: "#94a3b8" }}
                        domain={["dataMin - 100", "dataMax + 100"]}
                        label={{
                          value: "m³/dwelling/year",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#64748b",
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} m³`, "Average"]}
                        labelFormatter={(label) => `Year: ${label}`}
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "none",
                          borderRadius: "8px",
                          color: "#f8fafc",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Link
            to="/map"
            className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Open Interactive Map
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>
            Master's Thesis Project · Minnesota State University, Mankato
          </p>
        </div>
      </footer>
    </div>
  );
}
