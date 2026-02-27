import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Layer, LeafletMouseEvent } from "leaflet";
import type { Feature } from "geojson";
import type { GasConsumptionData, ConsumptionByMunicipality } from "@/types";
import {
  loadGasConsumptionData,
  loadMunicipalityGeoJSON,
  getConsumptionByYear,
  getConsumptionRange,
  getColorForConsumption,
  normalizeMunicipalityName,
  slugify,
} from "@/utils/dataUtils";
import { MunicipalityInfo } from "./MunicipalityInfo";
import "leaflet/dist/leaflet.css";

interface GasConsumptionMapProps {
  selectedYear: number;
}

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

export function GasConsumptionMap({ selectedYear }: GasConsumptionMapProps) {
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [consumptionData, setConsumptionData] = useState<GasConsumptionData | null>(null);
  const [consumptionByMunicipality, setConsumptionByMunicipality] = useState<ConsumptionByMunicipality>({});
  const [hoveredMunicipality, setHoveredMunicipality] = useState<string | null>(null);
  const [consumptionRange, setConsumptionRange] = useState<{ min: number; max: number }>({ min: 0, max: 2500 });

  useEffect(() => {
    async function loadData() {
      const [geo, consumption] = await Promise.all([
        loadMunicipalityGeoJSON(),
        loadGasConsumptionData(),
      ]);
      setGeoData(geo);
      setConsumptionData(consumption);
      setConsumptionRange(getConsumptionRange(consumption));
    }
    loadData();
  }, []);

  useEffect(() => {
    if (consumptionData) {
      setConsumptionByMunicipality(getConsumptionByYear(consumptionData, selectedYear));
    }
  }, [consumptionData, selectedYear]);

  // Calculate national average for selected year
  const nationalAverage = useMemo(() => {
    if (!consumptionData) return 0;
    const yearData = consumptionData.data.filter((r) => r.year === selectedYear);
    if (yearData.length === 0) return 0;
    const sum = yearData.reduce((acc, r) => acc + r.gas_consumption, 0);
    return Math.round(sum / yearData.length);
  }, [consumptionData, selectedYear]);

  // Calculate rankings for the selected year
  const rankings = useMemo(() => {
    const entries = Object.entries(consumptionByMunicipality)
      .filter(([, value]) => value != null)
      .sort(([, a], [, b]) => a - b); // Lower consumption = better rank

    const rankMap: { [name: string]: number } = {};
    entries.forEach(([name], index) => {
      rankMap[name] = index + 1;
    });
    return { rankMap, total: entries.length };
  }, [consumptionByMunicipality]);

  // Get previous year consumption data
  const previousYearConsumption = useMemo(() => {
    if (!consumptionData) return {};
    return getConsumptionByYear(consumptionData, selectedYear - 1);
  }, [consumptionData, selectedYear]);

  // Get sparkline data for a municipality
  const getSparklineData = (municipalityName: string) => {
    if (!consumptionData) return [];
    return consumptionData.data
      .filter((r) => r.municipality === municipalityName)
      .sort((a, b) => a.year - b.year)
      .map((r) => ({ year: r.year, value: r.gas_consumption }));
  };

  // Build tooltip data for hovered municipality
  const tooltipData: TooltipData | null = useMemo(() => {
    if (!hoveredMunicipality || !consumptionData) return null;

    const normalizedName = normalizeMunicipalityName(hoveredMunicipality);
    const consumption = consumptionByMunicipality[normalizedName] ?? null;
    const prevConsumption = previousYearConsumption[normalizedName];

    const yearOverYearChange =
      consumption !== null && prevConsumption != null
        ? ((consumption - prevConsumption) / prevConsumption) * 100
        : null;

    const color = consumption !== null
      ? getColorForConsumption(consumption, consumptionRange.min, consumptionRange.max)
      : "#ccc";

    return {
      name: hoveredMunicipality,
      consumption,
      nationalAverage,
      yearOverYearChange,
      rank: rankings.rankMap[normalizedName] ?? 0,
      totalMunicipalities: rankings.total,
      sparklineData: getSparklineData(hoveredMunicipality),
      color,
    };
  }, [hoveredMunicipality, consumptionData, consumptionByMunicipality, previousYearConsumption, nationalAverage, rankings, consumptionRange]);

  const style = (feature: Feature | undefined) => {
    if (!feature?.properties) return {};

    const name = normalizeMunicipalityName(feature.properties.statnaam);
    const consumption = consumptionByMunicipality[name];

    return {
      fillColor: getColorForConsumption(consumption, consumptionRange.min, consumptionRange.max),
      weight: 1,
      opacity: 1,
      color: "#666",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const name = feature.properties?.statnaam;
        setHoveredMunicipality(name);

        const target = e.target;
        target.setStyle({
          weight: 3,
          color: "#333",
          cursor: "pointer",
        });
        target.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredMunicipality(null);
        e.target.setStyle({
          weight: 1,
          color: "#666",
        });
      },
      click: () => {
        const name = feature.properties?.statnaam;
        if (name) {
          navigate(`/municipality/${slugify(name)}`);
        }
      },
    });
  };

  if (!geoData || !consumptionData) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-muted-foreground">
        Loading map data...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[52.2, 5.5]}
        zoom={8}
        minZoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          key={selectedYear}
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      {tooltipData && (
        <div className="absolute top-3 right-3 z-[1000]">
          <MunicipalityInfo
            data={tooltipData}
            year={selectedYear}
          />
        </div>
      )}
    </div>
  );
}
