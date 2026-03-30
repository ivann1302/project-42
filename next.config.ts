import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/shared/styles/mixins" as *;`,
  },
}

export default nextConfig
