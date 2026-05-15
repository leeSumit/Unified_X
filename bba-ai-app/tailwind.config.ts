import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          navy:        '#232F3E',
          'navy-dark': '#16202D',
          orange:      '#FF9900',
          'orange-hover': '#EC7211',
          blue:        '#0073BB',
          'blue-dark': '#146EB4',
          text:        '#16191F',
          muted:       '#545B64',
          border:      '#E9EBED',
          'input-border': '#8D9BA8',
          bg:          '#F2F3F3',
          card:        '#FFFFFF',
          success:     '#1D8102',
          error:       '#D13212',
        },
      },
      fontFamily: {
        sans: ['"Amazon Ember"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        aws: '2px',
      },
      boxShadow: {
        aws: '0 1px 3px rgba(0,0,0,0.08)',
        'aws-md': '0 2px 8px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [typography],
};

export default config;
