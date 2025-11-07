import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  env: {
    // Cloudflare Access設定（ミドルウェアで使用）
    POLICY_AUD: process.env.POLICY_AUD,
    TEAM_DOMAIN: process.env.TEAM_DOMAIN,
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
