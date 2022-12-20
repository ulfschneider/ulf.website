/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: {
    relative: true,
    files: ['content/pages/**/*',
      'content/posts/**/*',
      'content/tagintros/**/*',
      '_includes/**/*',
      '_layouts/**/*',
      '_eleventy/**/*',
      '_assets/js/**/*',
      '_assets/css/tailwind-extend-components.css']
  },
  theme: {
    screens: {
      'xs': '400px',
      'sm': '600px',
      'rg': '800px',
      'md': '1024px',
      'lg': '1280px',
      'xl': '1563px'
    },
    fontSize: {
      'sm': ['.9rem', '1.6'],
      'base': ['19px', '1.6'],
      'lg': ['1.15rem', '1.5'],
      'xl': ['1.2rem', '1.4'],
      '2xl': ['1.3rem', '1.4'],
      '3xl': ['2.2rem', '1.1'],
      '4xl': ['3.6rem', '1.1'],
      'smaller': 'smaller',
      'larger': 'larger'
    },
    fontFamily: {
      sans: ['"iA Writer Quattro"', 'sans-serif'],
      serif: ['"iA Writer Quattro"', 'sans-serif'],
      mono: ['"iA Writer Mono"', '"iA Writer Quattro"', 'monospace'],
      display: ['"IBM Plex Sans"', 'sans-serif'],
      body: ['"iA Writer Quattro"', 'sans-serif'],
    },
    extend: {
      colors: {
        'write': {
          light: colors.neutral[400],
          dark: colors.neutral[800]
        },
        'back': {
          light: colors.neutral[50],
          dark: colors.neutral[900]
        },
        'primary': {
          light: colors.cyan[300],
          DEFAULT: colors.cyan[600],
          dark: colors.cyan[900]
        },
        'link': {
          light: colors.cyan[300],
          DEFAULT: colors.cyan[600],
          dark: colors.cyan[800],
        },
        'meta': colors.neutral[500],
        'field': {
          light: 'white',
          dark: colors.neutral[700]
        },
        'light': {
          light: colors.neutral[50],
          DEFAULT: colors.neutral[200],
          dark: colors.neutral[800],
        },
        'outline': {
          light: colors.yellow[100],
          DEFAULT: colors.yellow[500],
          dark: colors.yellow[900]
        },
        'mark': {
          light: colors.yellow[100],
          DEFAULT: colors.yellow[300],
          dark: colors.yellow[600]
        },
        'orange': {
          light: colors.orange[100],
          DEFAULT: colors.orange[500],
          dark: colors.orange[900]
        },
        'red': {
          light: colors.red[100],
          DEFAULT: colors.red[500],
          dark: colors.red[900]
        },
        'green': {
          light: colors.green[100],
          DEFAULT: colors.green[500],
          dark: colors.green[900]
        },
        'purple': {
          light: colors.purple[100],
          DEFAULT: colors.purple[500],
          dark: colors.purple[900]
        },
        'blue': {
          light: colors.blue[100],
          DEFAULT: colors.blue[500],
          dark: colors.blue[900]
        },
      },
      spacing: {
        'ryt-3xs': '.1rem',
        'ryt-2xs': '.19rem',
        'ryt-xs': '.32rem',
        'ryt-sm': '.57rem',
        'ryt': '1rem',
        'ryt-lg': '1.75rem',
        'ryt-xl': '3rem',
        'ryt-2xl': '5.35rem',
        'ryt-3xl': '9.3rem',
        'xs': '16rem',
        'sm': '26rem',
        'rg': '36rem',
        'md': '46rem',
        'lg': '58rem',
        'xl': '70rem'
      },
      minWidth: {
        'ryt-3xs': '.1rem',
        'ryt-2xs': '.19rem',
        'ryt-xs': '.32rem',
        'ryt-sm': '.57rem',
        'ryt': '1rem',
        'ryt-lg': '1.75rem',
        'ryt-xl': '3rem',
        'ryt-2xl': '5.35rem',
        'ryt-3xl': '9.3rem',
        'xs': '16rem',
        'sm': '26rem',
        'rg': '36rem',
        'md': '46rem',
        'lg': '58rem',
        'xl': '70rem'
      },
      maxWidth: {
        'ryt-3xs': '.1rem',
        'ryt-2xs': '.19rem',
        'ryt-xs': '.32rem',
        'ryt-sm': '.57rem',
        'ryt': '1rem',
        'ryt-lg': '1.75rem',
        'ryt-xl': '3rem',
        'ryt-2xl': '5.35rem',
        'ryt-3xl': '9.3rem',
        'xs': '16rem',
        'sm': '26rem',
        'rg': '36rem',
        'md': '46rem',
        'lg': '58rem',
        'xl': '70rem'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities, addBase, theme, e, config }) {
    })]
}
