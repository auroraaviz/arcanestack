import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnvironment } from "./env";

export function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnvironment();
  return createBrowserClient(supabaseUrl, supabaseKey);
}
