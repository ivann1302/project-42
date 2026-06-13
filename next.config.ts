import type { NextConfig } from 'next'

const output = process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : 'export'

const nextConfig: NextConfig = {
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
