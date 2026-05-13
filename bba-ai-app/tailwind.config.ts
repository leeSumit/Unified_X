import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#5B2D8E',
          'purple-dark': '#3D1D6E',
          'purple-light': '#7B4DB8',
          orange: '#E8681A',
          'orange-light': '#F08040',
          cream: '#F5F0E8',
          'cream-dark': '#EDE6D8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
