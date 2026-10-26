import type { NextConfig } from 'next'

const output = process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : 'export'

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output,
  ...(output === 'export' && {
    images: {
      unoptimized: true,
    },
  }),
  sassOptions: {
    additionalData: `@use "@/shared/styles/mixins" as *;`,
  },
}

export default nextConfig
