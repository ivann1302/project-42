import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  sassOptions: {
    additionalData: `@use "@/shared/styles/mixins" as *;`,
  },
}

export default nextConfig
