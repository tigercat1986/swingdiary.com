import type { Config } from 'tailwindcss'
import tokens from './design-tokens.json'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: tokens.color.brand.primary,
          fg: tokens.color.brand.primaryFg,
          secondary: tokens.color.brand.secondary,
        },
        fg: tokens.color.fg,
        bg: tokens.color.bg,
        border: tokens.color.border,
        accent: tokens.color.accent,
      },
      borderRadius: {
        DEFAULT: tokens.radius.md,
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        xl: tokens.radius.xl,
        pill: tokens.radius.pill,
      },
      boxShadow: {
        sm: tokens.shadow.sm,
        md: tokens.shadow.md,
        lg: tokens.shadow.lg,
      },
      spacing: tokens.space,
      fontSize: tokens.font.size,
      fontFamily: {
        sans: (tokens.font.family.sans as string).split(',').map((f: string) => f.trim()),
      },
      fontWeight: Object.fromEntries(
        Object.entries(tokens.font.weight).map(([key, value]) => [key, String(value)])
      ) as Record<string, string>,
      lineHeight: tokens.font.leading,
      transitionDuration: {
        fast: tokens.motion.fast,
        base: tokens.motion.base,
        slow: tokens.motion.slow,
      },
      transitionTimingFunction: {
        ease: tokens.motion.ease,
      },
      maxWidth: {
        container: tokens.container.max,
      },
    },
  },
  plugins: [],
}
export default config
