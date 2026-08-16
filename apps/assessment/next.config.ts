import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /*
   * The repo root also has a lockfile, since the design system itself has dev
   * dependencies. Without this, Next infers the repo root as the workspace root and
   * warns on every build. Pinning it to this app makes the choice explicit.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
