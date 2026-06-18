'use client'

import { useEffect } from 'react'
import { captureLeadAttribution } from '@/shared/lib/leadSource'

export function LeadAttribution() {
  useEffect(() => {
    captureLeadAttribution()
  }, [])

  return null
}
