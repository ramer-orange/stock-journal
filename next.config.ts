import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ALLOWED_IPS: process.env.ALLOWED_IPS,
    DISABLE_IP_RESTRICTION: process.env.DISABLE_IP_RESTRICTION,
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
