import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, HelpCircle, Map, SearchX } from "lucide-react";
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

      {/* Header */}
      <header className="bg-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors"
          >
            Explore Map
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-800 text-white pb-24 pt-8">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Master's Thesis · Data Science
          </p>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Predicting Residential Natural Gas Consumption at Municipal Level Using Machine Learning
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

      {/* Abstract */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-800">Abstract</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-slate-600 leading-relaxed mb-4">
                Residential natural gas consumption is still the largest source of CO₂ emissions for most Dutch households, and municipalities are now responsible for planning the transition away from it. But existing research at the municipal level hasn't moved much beyond descriptive statistics and simple regression. That's the gap this thesis tries to fill.
              </p>
              <p className="text-slate-600 leading-relaxed">
                This thesis applies Random Forest and XGBoost to a panel dataset covering all ~340 Dutch municipalities from 2015 to 2024, combining CBS gas consumption figures with housing stock data from Kadaster/BAG, socio-demographic variables, and heating degree days from KNMI. Model performance is measured using RMSE, MAE, and R², with SHAP values used to identify which features drive consumption differences between municipalities. Tree-based models outperform linear baselines. Housing stock composition and weather [will probably] turn out to be the strongest predictors.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Research Questions */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-800">Research Questions</h2>
          </div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Main question</p>
              <p className="text-slate-800 text-lg font-medium leading-relaxed">
                How accurately can machine learning models predict residential natural gas consumption at the municipal level?
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

      {/* Research Gaps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <SearchX className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-800">Research Gaps</h2>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            Despite rich data infrastructure and an active policy need, three gaps in the literature motivated this thesis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Gap 1",
                title: "No municipal-level ML models",
                body: "Existing Dutch research stops at descriptive statistics and simple regression. No study has applied machine learning to predict gas consumption across all ~340 municipalities.",
              },
              {
                label: "Gap 2",
                title: "Building-level bias",
                body: "Most energy ML research works at the building level where fine-grained features are available. Aggregate municipal studies are rare and rely on weaker proxy variables.",
              },
              {
                label: "Gap 3",
                title: "Cross-sectional data only",
                body: "Most municipal studies use a single year, making it impossible to separate weather effects from structural trends. A longitudinal panel is needed to control for heating degree days properly.",
              },
            ].map(({ label, title, body }) => (
              <Card key={label}>
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                  <p className="text-slate-800 font-semibold mb-2">{title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore the Data */}
      <section className="py-16">
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
        <div className="max-w-4xl mx-auto px-6 text-center text-slate-500 text-sm space-y-2">
          <p>
            Master's Thesis Project · Minnesota State University, Mankato
          </p>
          <a
            href="https://github.com/martenweijer/thesis-gas-consumption-netherlands"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
