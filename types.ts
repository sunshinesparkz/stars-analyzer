export interface PlanetAnalysis {
  planetName: string;
  isSolarSystem: boolean;
  earthSimilarityPercentage: number;
  habitabilityScore: number; // 0-100
  habitabilityAnalysis: string;
  compositionComparison: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: PlanetAnalysis | null;
  error: string | null;
  imagePreview: string | null;
}