/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: {
    relative: true,
    files: ['content/pages/**/*',
      'contentt/posts/**/*',
      'content/tagintros/**/*',
      '_includes/**/*',
      '_layouts/**/*',
      '_eleventy/**/*',
      '_assets/js/**/*',
      '_assets/css/customize.css']
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
      'base': ['20px', '1.6'],
      'lg': ['1.15rem', '1.5'],
      'xl': ['1.3rem', '1.4'],
      '2xl': ['1.4rem', '1.3'],
      '3xl': ['3.2rem', '1.1'],
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
        'primary': {
          light: colors.cyan[100],
          DEFAULT: colors.cyan[500],
          dark: colors.cyan[900]
        },
        'link': colors.cyan[600],
        'meta': colors.stone[500],
        'light': colors.stone[200],
        'outline': colors.yellow[500]
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
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addUtilities, addBase, theme, e, config }) {
    })]
}
