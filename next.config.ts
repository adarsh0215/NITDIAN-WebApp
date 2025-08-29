// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google OAuth profile photos
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Supabase Storage public URLs (replace YOUR-REF)
      { protocol: "https", hostname: "YOUR-REF.supabase.co" },
      // (optional) common avatar hosts you might use:
      // { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
};

export default nextConfig;
