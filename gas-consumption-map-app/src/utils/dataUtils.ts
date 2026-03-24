import type { GasConsumptionData, ConsumptionByMunicipality } from "../types";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findMunicipalityBySlug(
  data: GasConsumptionData,
  slug: string
): string | null {
  const municipalities = new Set(data.data.map((r) => r.municipality));
  for (const name of municipalities) {
    if (slugify(name) === slug) {
      return name;
    }
  }
  return null;
}

export async function loadGasConsumptionData(): Promise<GasConsumptionData> {
  const response = await fetch("/gas_consumption.json");
  return response.json();
}

export async function loadMunicipalityGeoJSON(): Promise<GeoJSON.FeatureCollection> {
  const response = await fetch("/gemeenten.geojson");
  return response.json();
}

export function getConsumptionByYear(
  data: GasConsumptionData,
  year: number
): ConsumptionByMunicipality {
  const result: ConsumptionByMunicipality = {};

  for (const record of data.data) {
    if (record.year === year) {
      const normalizedName = normalizeMunicipalityName(record.municipality);
      result[normalizedName] = record.gas_consumption;
    }
  }

  return result;
}

export function normalizeMunicipalityName(name: string): string {
  return name
    .replace(" (gemeente)", "")
    .replace(" (Utrecht)", "")
    .replace(" (Groningen)", "")
    .replace(" (Limburg)", "")
    .replace(" (Friesland)", "")
    .replace(" (Fryslân)", "")
    .replace(" (Noord-Brabant)", "")
    .replace(" (Gelderland)", "")
    .replace(" (Noord-Holland)", "")
    .replace(" (Zuid-Holland)", "")
    .replace(" (Overijssel)", "")
    .trim();
}

export function getAvailableYears(data: GasConsumptionData): number[] {
  const years = new Set<number>();
  for (const record of data.data) {
    years.add(record.year);
  }
  return Array.from(years).sort((a, b) => b - a);
}

export function getConsumptionRange(
  data: GasConsumptionData
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;

  for (const record of data.data) {
    if (record.gas_consumption < min) min = record.gas_consumption;
    if (record.gas_consumption > max) max = record.gas_consumption;
  }

  return { min, max };
}

export function getColorForConsumption(
  value: number
): string {
  if (value === null || value === undefined) {
    return "#ccc";
  }

  if (value < 600) return '#fee5d9'
  if (value < 800) return '#fcbba1'
  if (value < 1000) return '#fc9272'
  if (value < 1200) return '#fb6a4a'
  if (value < 1400) return '#ef3b2c'
  if (value < 1600) return '#cb181d'
  return '#99000d'
}
