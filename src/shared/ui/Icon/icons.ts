// SVG icon registry — add new icons here as needed
export const icons = {
  arrowRight: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>`,
  check: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>`,
  close: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/>`,
  menu: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>`,
  send: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>`,
  instagram: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>`,
  linkedin: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2" fill="none"/>`,
  star: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  phone: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18H5a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.354 1.843.598 2.81.7A2 2 0 0122 14.92z"/>`,
  chevronDown: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/>`,
} as const

export type IconName = keyof typeof icons
