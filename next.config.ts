import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The matcher reads this markdown at request time; make sure it ships with the function bundle.
  outputFileTracingIncludes: {
    "/api/submit": ["./doc/personality_quiz_context.md"],
  },
  images: {
    remotePatterns: [
      // Supabase Storage public URLs for submitter photos.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
