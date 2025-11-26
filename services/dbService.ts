import { supabase } from './supabaseClient';
import { PlanetAnalysis } from '../types';

export const saveAnalysisToSupabase = async (data: PlanetAnalysis) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn("Skipping database save: Supabase not configured");
    return null;
  }

  // Map CamelCase interface to snake_case database columns
  const payload = {
    planet_name: data.planetName,
    is_solar_system: data.isSolarSystem,
    earth_similarity_percentage: data.earthSimilarityPercentage,
    habitability_score: data.habitabilityScore,
    habitability_analysis: data.habitabilityAnalysis,
    composition_comparison: data.compositionComparison
  };

  const { data: insertedData, error } = await supabase
    .from('planet_analyses')
    .insert([payload])
    .select();

  if (error) {
    console.error("Error saving to Supabase:", error);
    throw new Error("ไม่สามารถบันทึกข้อมูลลงฐานข้อมูลได้");
  }

  return insertedData;
};