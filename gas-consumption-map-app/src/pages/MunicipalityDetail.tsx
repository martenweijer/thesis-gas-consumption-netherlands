import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import { Home, Map, TrendingDown, TrendingUp, Minus, Award, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  loadGasConsumptionData,
  loadMunicipalityGeoJSON,
  findMunicipalityBySlug,
  slugify,
  normalizeMunicipalityName,
} from "@/utils/dataUtils";
import type { GasConsumptionData, GasConsumptionRecord } from "@/types";
import "leaflet/dist/leaflet.css";

interface YearlyDataWithStats {
  year: number;
  gas_consumption: number;
  nationalAverage: number;
  rank: number;
  totalMunicipalities: number;
  yearOverYearChange: number | null;
  isMin: boolean;
  isMax: boolean;
}

export function MunicipalityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<GasConsumptionData | null>(null);
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [municipalityName, setMunicipalityName] = useState<string | null>(null);
  const [records, setRecords] = useState<GasConsumptionRecord[]>([]);

  useEffect(() => {
    async function load() {
      const [consumptionData, geo] = await Promise.all([
        loadGasConsumptionData(),
        loadMunicipalityGeoJSON(),
      ]);
      setData(consumptionData);
      setGeoData(geo);

      if (slug) {
        const name = findMunicipalityBySlug(consumptionData, slug);
        setMunicipalityName(name);

        if (name) {
          const municipalityRecords = consumptionData.data
            .filter((r) => r.municipality === name)
            .sort((a, b) => a.year - b.year);
          setRecords(municipalityRecords);
        }
      }
    }
    load();
  }, [slug]);

  // Calculate national averages per year
  const nationalAverages = useMemo(() => {
    if (!data) return {};
    const averages: { [year: number]: number } = {};
    const yearGroups: { [year: number]: number[] } = {};

    for (const record of data.data) {
      if (!yearGroups[record.year]) {
        yearGroups[record.year] = [];
      }
      yearGroups[record.year].push(record.gas_consumption);
    }

    for (const [year, values] of Object.entries(yearGroups)) {
      averages[parseInt(year)] = Math.round(
        values.reduce((a, b) => a + b, 0) / values.length
      );
    }

    return averages;
  }, [data]);

  // Calculate rankings per year
  const rankingsPerYear = useMemo(() => {
    if (!data) return {};
    const rankings: { [year: number]: { [municipality: string]: { rank: number; total: number } } } = {};

    const years = [...new Set(data.data.map((r) => r.year))];

    for (const year of years) {
      const yearData = data.data
        .filter((r) => r.year === year)
        .sort((a, b) => a.gas_consumption - b.gas_consumption);

      rankings[year] = {};
      yearData.forEach((record, index) => {
        const normalizedName = normalizeMunicipalityName(record.municipality);
        rankings[year][normalizedName] = {
          rank: index + 1,
          total: yearData.length,
        };
      });
    }

    return rankings;
  }, [data]);

  // Build enriched yearly data with all stats
  const enrichedData: YearlyDataWithStats[] = useMemo(() => {
    if (records.length === 0 || !municipalityName) return [];

    const normalizedName = normalizeMunicipalityName(municipalityName);
    const values = records.map((r) => r.gas_consumption);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    return records.map((record, index) => {
      const prevRecord = records[index - 1];
      const yearOverYearChange = prevRecord
        ? ((record.gas_consumption - prevRecord.gas_consumption) / prevRecord.gas_consumption) * 100
        : null;

      const ranking = rankingsPerYear[record.year]?.[normalizedName];

      return {
        year: record.year,
        gas_consumption: record.gas_consumption,
        nationalAverage: nationalAverages[record.year] ?? 0,
        rank: ranking?.rank ?? 0,
        totalMunicipalities: ranking?.total ?? 0,
        yearOverYearChange,
        isMin: record.gas_consumption === minValue,
        isMax: record.gas_consumption === maxValue,
      };
    });
  }, [records, municipalityName, nationalAverages, rankingsPerYear]);

  // Calculate current percentile
  const currentPercentile = useMemo(() => {
    if (enrichedData.length === 0) return null;
    const latest = enrichedData[enrichedData.length - 1];
    if (!latest.totalMunicipalities) return null;
    return Math.round((latest.rank / latest.totalMunicipalities) * 100);
  }, [enrichedData]);

  const stats = useMemo(() => {
    if (records.length === 0) return null;

    const values = records.map((r) => r.gas_consumption);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const latest = records[records.length - 1]?.gas_consumption ?? 0;
    const previous = records[records.length - 2]?.gas_consumption ?? latest;
    const yearChange = latest - previous;
    const yearChangePercent = previous ? (yearChange / previous) * 100 : 0;

    const oldest = records[0]?.gas_consumption ?? 0;
    const totalChange = latest - oldest;
    const totalChangePercent = oldest ? (totalChange / oldest) * 100 : 0;

    const latestYear = records[records.length - 1]?.year;
    const latestNationalAvg = nationalAverages[latestYear] ?? 0;
    const diffFromNational = latest - latestNationalAvg;
    const diffFromNationalPercent = latestNationalAvg
      ? (diffFromNational / latestNationalAvg) * 100
      : 0;

    return {
      min,
      max,
      avg,
      latest,
      yearChange,
      yearChangePercent,
      totalChange,
      totalChangePercent,
      diffFromNational,
      diffFromNationalPercent,
      latestNationalAvg,
    };
  }, [records, nationalAverages]);

  const municipalityGeoData = useMemo(() => {
    if (!geoData || !municipalityName) return null;

    const feature = geoData.features.find(
      (f) => slugify(f.properties?.statnaam) === slug
    );

    if (!feature) return null;

    return {
      type: "FeatureCollection" as const,
      features: [feature],
    };
  }, [geoData, municipalityName, slug]);

  const mapCenter = useMemo(() => {
    if (!municipalityGeoData) return [52.2, 5.5] as [number, number];

    const feature = municipalityGeoData.features[0];
    const coords =
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates[0]
        : feature.geometry.type === "MultiPolygon"
          ? feature.geometry.coordinates[0][0]
          : [];

    if (coords.length === 0) return [52.2, 5.5] as [number, number];

    const lats = coords.map((c: number[]) => c[1]);
    const lngs = coords.map((c: number[]) => c[0]);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ] as [number, number];
  }, [municipalityGeoData]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!municipalityName) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Municipality not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The municipality "{slug}" could not be found.
            </p>
            <div className="flex gap-4">
              <Link to="/" className="text-blue-600 hover:underline">
                Go to Home
              </Link>
              <Link to="/map" className="text-blue-600 hover:underline">
                Go to Map
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestData = enrichedData[enrichedData.length - 1];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-800 text-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </Link>
            <span className="text-slate-500">/</span>
            <Link
              to="/map"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Map className="w-4 h-4" />
              <span className="text-sm">Map</span>
            </Link>
          </nav>
          <span className="text-slate-500">/</span>
          <h1 className="text-lg font-medium">{municipalityName}</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Latest ({records[records.length - 1]?.year})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.latest.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">m³/dwelling</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  vs National Avg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${stats.diffFromNational < 0 ? "text-green-600" : stats.diffFromNational > 0 ? "text-red-600" : ""}`}
                >
                  {stats.diffFromNational > 0 ? "+" : ""}
                  {stats.diffFromNationalPercent.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: {stats.latestNationalAvg.toLocaleString()} m³
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Year-over-Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${stats.yearChange < 0 ? "text-green-600" : stats.yearChange > 0 ? "text-red-600" : ""}`}
                >
                  {stats.yearChange > 0 ? "+" : ""}
                  {stats.yearChangePercent.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.yearChange > 0 ? "+" : ""}
                  {stats.yearChange.toLocaleString()} m³
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Since {records[0]?.year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${stats.totalChange < 0 ? "text-green-600" : stats.totalChange > 0 ? "text-red-600" : ""}`}
                >
                  {stats.totalChange > 0 ? "+" : ""}
                  {stats.totalChangePercent.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalChange > 0 ? "+" : ""}
                  {stats.totalChange.toLocaleString()} m³
                </p>
              </CardContent>
            </Card>

            {/* Percentile Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  #{latestData?.rank}
                </div>
                <p className="text-xs text-muted-foreground">
                  Top {currentPercentile}% (of {latestData?.totalMunicipalities})
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Percentile Visual */}
        {currentPercentile !== null && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Percentile Position (lower consumption = better)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg border-2 border-slate-800"
                  style={{ left: `${currentPercentile}%`, transform: "translateX(-50%)" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Lowest consumption</span>
                <span>Highest consumption</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Chart with National Average */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Gas Consumption vs National Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrichedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
                    <Tooltip
                      formatter={(value, _name, props) => [
                        `${Number(value).toLocaleString()} m³`,
                        props.dataKey === "gas_consumption" ? municipalityName : "National Average",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="gas_consumption"
                      name={municipalityName ?? "Municipality"}
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={{ fill: "#dc2626", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="nationalAverage"
                      name="National Average"
                      stroke="#6b7280"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Mini Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 rounded-lg overflow-hidden">
                {municipalityGeoData && (
                  <MapContainer
                    center={mapCenter}
                    zoom={10}
                    scrollWheelZoom={false}
                    dragging={false}
                    zoomControl={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
                    <GeoJSON
                      data={municipalityGeoData}
                      style={{
                        fillColor: "#dc2626",
                        fillOpacity: 0.6,
                        color: "#991b1b",
                        weight: 2,
                      }}
                    />
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking Over Time (lower = better)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrichedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    reversed
                    domain={[1, "dataMax + 20"]}
                    label={{ value: "Rank", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    formatter={(value) => [`#${value}`, "Rank"]}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <ReferenceLine y={enrichedData[0]?.totalMunicipalities / 2} stroke="#9ca3af" strokeDasharray="3 3" />
                  <Bar dataKey="rank" fill="#3b82f6">
                    {enrichedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.rank <= entry.totalMunicipalities * 0.25
                            ? "#22c55e"
                            : entry.rank <= entry.totalMunicipalities * 0.5
                              ? "#eab308"
                              : entry.rank <= entry.totalMunicipalities * 0.75
                                ? "#f97316"
                                : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Data with YoY Change and Min/Max */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {enrichedData.map((record) => {
                const YoYIcon =
                  record.yearOverYearChange === null
                    ? null
                    : record.yearOverYearChange < 0
                      ? TrendingDown
                      : record.yearOverYearChange > 0
                        ? TrendingUp
                        : Minus;

                const yoyColor =
                  record.yearOverYearChange === null
                    ? ""
                    : record.yearOverYearChange < 0
                      ? "text-green-600"
                      : record.yearOverYearChange > 0
                        ? "text-red-600"
                        : "text-muted-foreground";

                return (
                  <div
                    key={record.year}
                    className={`rounded-lg p-2 text-center relative ${
                      record.isMin
                        ? "bg-green-100 ring-2 ring-green-500"
                        : record.isMax
                          ? "bg-red-100 ring-2 ring-red-500"
                          : "bg-slate-100"
                    }`}
                  >
                    {record.isMin && (
                      <div className="absolute -top-2 -right-2">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    {record.isMax && (
                      <div className="absolute -top-2 -right-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">{record.year}</div>
                    <div className="text-sm font-semibold">
                      {record.gas_consumption.toLocaleString()}
                    </div>
                    {YoYIcon && (
                      <div className={`flex items-center justify-center gap-0.5 text-[10px] ${yoyColor}`}>
                        <YoYIcon className="w-3 h-3" />
                        <span>
                          {record.yearOverYearChange! > 0 ? "+" : ""}
                          {record.yearOverYearChange!.toFixed(1)}%
                        </span>
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground">
                      #{record.rank}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 text-green-600" />
                <span>Lowest year</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>Highest year</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
