/** Server-only env access. Never import this from a client component. */
export const env = {
  appPassword: process.env.APP_PASSWORD ?? "durf",
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export const hasOpenAI = Boolean(env.openaiApiKey);
export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
