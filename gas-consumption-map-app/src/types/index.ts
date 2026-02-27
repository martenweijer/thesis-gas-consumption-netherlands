export interface GasConsumptionRecord {
  municipality: string;
  year: number;
  gas_consumption: number;
}

export interface GasConsumptionData {
  metadata: {
    source: string;
    description: string;
    unit: string;
    housing_type: string;
    years_covered: string;
    municipalities_count: number;
    records_count: number;
  };
  data: GasConsumptionRecord[];
}

export interface MunicipalityFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    statcode: string;
    statnaam: string;
    [key: string]: unknown;
  };
  id: string;
}

export interface MunicipalityGeoJSON {
  type: "FeatureCollection";
  features: MunicipalityFeature[];
}

export interface ConsumptionByMunicipality {
  [municipalityName: string]: number;
}
