import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Light, airy neutrals. Colour comes from the aurora wash, not from surfaces.
        canvas: '#F7F7F8',
        sunken: '#F2F3F5',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#FAFAFB',
        },
        elevated: '#FFFFFF',
        panel: '#F1F2F4',
        subtle: '#ECEEF1',
        ink: {
          DEFAULT: '#121316',
          soft: '#5F6470',
          faint: '#9298A3',
        },
        line: {
          DEFAULT: '#ECEDF0',
          strong: '#E1E3E8',
          hover: '#CDD1D8',
          faint: '#F2F3F5',
        },
        // Charcoal carries actions (solid); blue is the voice/live colour (DEFAULT).
        accent: {
          DEFAULT: '#2F6BFF',
          strong: '#1D4ED8',
          solid: '#16171A',
          hover: '#2C2E34',
          soft: '#EEF3FF',
          line: '#D5E1FF',
          ink: '#FFFFFF',
        },
        signal: '#2F6BFF',
        // Pastel aurora. Atmosphere and icon tiles only, never text.
        aura: {
          sun: '#FCE9A9',
          peach: '#FDDCC0',
          sky: '#C7E6F5',
          mint: '#CDEFE2',
          lilac: '#E2DDFB',
        },
        danger: {
          DEFAULT: '#E5484D',
          hover: '#CE3A3F',
          soft: '#FDEEEE',
        },
      },
      fontFamily: {
        sans: ['Onest', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16, 18, 24, 0.05)',
        soft: '0 1px 2px rgba(16, 18, 24, 0.04), 0 8px 24px rgba(16, 18, 24, 0.05)',
        menu: '0 1px 2px rgba(16, 18, 24, 0.06), 0 16px 40px rgba(16, 18, 24, 0.10)',
        float: '0 1px 2px rgba(16, 18, 24, 0.05), 0 18px 44px rgba(16, 18, 24, 0.10)',
        card: '0 1px 2px rgba(16, 18, 24, 0.04), 0 24px 60px rgba(16, 18, 24, 0.08)',
        button: 'inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 1px 2px rgba(16, 18, 24, 0.25), 0 4px 12px rgba(16, 18, 24, 0.12)',
        // Soft blue halo, used by the interview tile while the candidate speaks. Form fields use no shadow.
        focus: '0 0 0 2px rgba(47, 107, 255, 0.10)',
      },
      backgroundImage: {
        dots: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23121316' fill-opacity='0.06'/%3E%3C/svg%3E\")",
        // Soft sunrise wash: butter and peach on the left, sky and mint on the right.
        aurora: 'radial-gradient(42% 60% at 18% 62%, rgba(250, 222, 130, 0.95), transparent 70%), radial-gradient(34% 50% at 4% 30%, rgba(252, 200, 160, 0.9), transparent 70%), radial-gradient(40% 58% at 84% 55%, rgba(170, 218, 240, 1), transparent 70%), radial-gradient(30% 40% at 62% 82%, rgba(190, 234, 214, 0.85), transparent 70%)',
        'aurora-soft': 'radial-gradient(60% 70% at 15% 85%, rgba(252, 233, 169, 0.55), transparent 70%), radial-gradient(55% 65% at 90% 15%, rgba(199, 230, 245, 0.7), transparent 70%), radial-gradient(40% 50% at 70% 95%, rgba(205, 239, 226, 0.5), transparent 70%)',
      },
      backgroundSize: {
        dots: '22px 22px',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        caret: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
        eq: {
          from: { scale: '1 0.35' },
          to: { scale: '1 1' },
        },
        talk: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.45)' },
        },
        spark: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(0.7) rotate(45deg)', opacity: '0.7' },
        },
        fill: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        ripple: {
          from: { transform: 'scale(1)', opacity: '0.55' },
          to: { transform: 'scale(1.75)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.05)' },
        },
      },
      animation: {
        rise: 'rise 420ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        blink: 'blink 1.6s ease-in-out infinite',
        caret: 'caret 1s linear infinite',
        marquee: 'marquee 70s linear infinite',
        eq: 'eq 800ms ease-in-out infinite alternate',
        talk: 'talk 1.1s ease-in-out infinite',
        spark: 'spark 2.4s ease-in-out infinite',
        fill: 'fill 2.6s ease-out forwards',
        ripple: 'ripple 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite',
        'spin-slow': 'spin 60s linear infinite',
        'spin-fast': 'spin 9s linear infinite',
        drift: 'drift 18s ease-in-out infinite',
      },
    },
  },
} satisfies Config
