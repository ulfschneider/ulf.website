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
      'xl': '1560px'
    },
    fontSize: {
      'sm': ['var(--font-size-sm)', '1.6'],
      'base': ['var(--font-size-base)', '1.6'],
      'lg': ['var(--font-size-lg)', '1.4'],
      'xl': ['var(--font-size-xl)', '1.3'],
      '2xl': ['var(--font-size-2xl)', '1.2'],
      '3xl': ['var(--font-size-3xl)', '1.2'],
      '4xl': ['var(--font-size-4xl)', '1.2'],
      '5xl': ['var(--font-size-5xl)', '1.2'],
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
          light: colors.neutral[300],
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
          light: colors.yellow[300],
          DEFAULT: colors.yellow[400],
          dark: colors.yellow[700]
        },
        'mark': {
          light: colors.yellow[100],
          DEFAULT: colors.yellow[200],
          dark: colors.yellow[400]
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
      transitionProperty: {
        'spacing': 'margin, padding, width, height'
      },
      spacing: {
        'ryt-3xs': 'var(--ryt-3xs)',
        'ryt-2xs': 'var(--ryt-2xs)',
        'ryt-xs': 'var(--ryt-xs)',
        'ryt-sm': 'var(--ryt-sm)',
        'ryt': 'var(--ryt)',
        'ryt-lg': 'var(--ryt-lg)',
        'ryt-xl': 'var(--ryt-xl)',
        'ryt-2xl': 'var(--ryt-2xl)',
        'ryt-3xl': 'var(--ryt-3xl)',
        'xs': 'var(--xs)',
        'sm': 'var(--sm)',
        'rg': 'var(--rg)',
        'md': 'var(--md)',
        'lg': 'var(--lg)',
        'xl': 'var(--xl)'
      },
      minWidth: {
        'ryt-3xs': 'var(--ryt-3xs)',
        'ryt-2xs': 'var(--ryt-2xs)',
        'ryt-xs': 'var(--ryt-xs)',
        'ryt-sm': 'var(--ryt-sm)',
        'ryt': 'var(--ryt)',
        'ryt-lg': 'var(--ryt-lg)',
        'ryt-xl': 'var(--ryt-xl)',
        'ryt-2xl': 'var(--ryt-2xl)',
        'ryt-3xl': 'var(--ryt-3xl)',
        'xs': 'var(--xs)',
        'sm': 'var(--sm)',
        'rg': 'var(--rg)',
        'md': 'var(--md)',
        'lg': 'var(--lg)',
        'xl': 'var(--xl)'
      },
      maxWidth: {
        'ryt-3xs': 'var(--ryt-3xs)',
        'ryt-2xs': 'var(--ryt-2xs)',
        'ryt-xs': 'var(--ryt-xs)',
        'ryt-sm': 'var(--ryt-sm)',
        'ryt': 'var(--ryt)',
        'ryt-lg': 'var(--ryt-lg)',
        'ryt-xl': 'var(--ryt-xl)',
        'ryt-2xl': 'var(--ryt-2xl)',
        'ryt-3xl': 'var(--ryt-3xl)',
        'xs': 'var(--xs)',
        'sm': 'var(--sm)',
        'rg': 'var(--rg)',
        'md': 'var(--md)',
        'lg': 'var(--lg)',
        'xl': 'var(--xl)'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities, addBase, theme, e, config }) {
    })]
}
