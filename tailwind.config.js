/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: { DEFAULT: 'var(--background)' },
        foreground: { DEFAULT: 'var(--foreground)' },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        surface: {
          DEFAULT: 'var(--bg)',
        },
        ink: {
          DEFAULT: 'var(--fg)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: { DEFAULT: 'var(--border)' },
        input: { DEFAULT: 'var(--input)' },
        ring: { DEFAULT: 'var(--ring)' },
      },
      fontFamily: {
        
        heading: ['var(--font-fraunces)', 'sans-serif'],
        
        
        sans: ['var(--font-jetbrains-mono)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius)',
        md: 'var(--radius)',
        lg: 'var(--radius)',
        xl: 'var(--radius)',
        '2xl': 'var(--radius)',
        full: '9999px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        brutal: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      aspectRatio: {
        'cinema': '21 / 9',
        'portrait': '3 / 4',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};