export type ThemeName = 'dark' | 'light'

export interface Theme {
  bg: string
  zone: string // slightly darker background for the playground zone
  text: string
  name: string // headings, your name, active links
  muted: string
  skull: string
  embers: [string, string, string] // bright -> fading
}

// Light mode is the dark palette with the two greens swapped.
export const THEMES: Record<ThemeName, Theme> = {
  dark: {
    bg: '#161a13', zone: '#0f120d', text: '#c3cbbb', name: '#dfe6d6', muted: '#8f9988',
    skull: '#7e8b72', embers: ['#dfe6d6', '#c3cbbb', '#7e8b72'],
  },
  light: {
    bg: '#7e8b72', zone: '#728066', text: '#161a13', name: '#161a13', muted: '#161a13',
    skull: '#161a13', embers: ['#161a13', '#3a4232', '#5c6752'],
  },
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
