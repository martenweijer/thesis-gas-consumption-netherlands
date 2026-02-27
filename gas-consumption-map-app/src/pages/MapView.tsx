import { useState } from "react";
import { Link } from "react-router-dom";
import { GasConsumptionMap } from "@/components/GasConsumptionMap";
import { Home } from "lucide-react";

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export function MapView() {
  const [selectedYear, setSelectedYear] = useState(2015);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-slate-800 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm">Home</span>
            </Link>
            <h1 className="text-lg font-medium">Netherlands Gas Consumption by Municipality</h1>
          </div>
          <div className="flex gap-1">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedYear === year
                    ? "bg-white text-slate-800 font-medium"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        <GasConsumptionMap selectedYear={selectedYear} />
      </main>
    </div>
  );
}
