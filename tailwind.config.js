/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

module.exports = {
  content: {
    relative: true,
    files: [
      "content/pages/**/*",
      "content/posts/**/*",
      "content/tagintros/**/*",
      "_includes/**/*",
      "_layouts/**/*",
      "_eleventy/**/*",
      "_assets/js/**/*",
      "_assets/css/tailwind-extend-components.css",
    ],
  },
  theme: {
    screens: {
      xs: "400px",
      sm: "600px",
      rg: "840px",
      md: "1024px",
      lg: "1280px",
      xl: "1560px",
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    fontSize: {
      sm: ["var(--font-size-sm)", 1.625],
      base: ["var(--font-size-base)", 1.625],
      lg: ["var(--font-size-lg)", 1.5],
      xl: ["var(--font-size-xl)", 1.375],
      "2xl": ["var(--font-size-2xl)", 1.25],
      "3xl": ["var(--font-size-3xl)", 1.25],
      "4xl": ["var(--font-size-4xl)", 1.25],
      "5xl": ["var(--font-size-5xl)", 1.25],
      smaller: "smaller",
      larger: "larger",
    },
    fontFamily: {
      sans: ['"iA Writer Quattro"', "sans-serif"],
      serif: ['"iA Writer Quattro"', "sans-serif"],
      mono: ['"iA Writer Mono"', '"iA Writer Quattro"', "monospace"],
      display: ['"iA Writer Quattro"', "sans-serif"],
      body: ['"iA Writer Quattro"', "sans-serif"],
    },
    extend: {
      colors: {
        write: {
          bright: colors.neutral[200],
          light: "#c3c3c3",
          dark: colors.neutral[800],
        },
        back: {
          light: "#f7f7f7",
          dark: colors.neutral[900],
        },
        primary: {
          light: "#208bff",
          DEFAULT: "#0969da",
          dark: "#033d8b",
        },
        meta: colors.neutral[500],
        disabled: colors.neutral[400],
        field: {
          light: "white",
          dark: colors.neutral[800],
        },
        light: {
          light: "#f7f7f7",
          DEFAULT: colors.neutral[200],
          dark: colors.neutral[700],
        },
        mark: {
          light: colors.yellow[100],
          DEFAULT: colors.yellow[200],
          dark: colors.yellow[400],
        },
        orange: {
          light: colors.orange[100],
          DEFAULT: colors.orange[500],
          dark: colors.orange[900],
        },
        red: {
          light: colors.red[400],
          DEFAULT: colors.red[600],
          dark: colors.red[800],
        },
        green: {
          light: colors.green[100],
          DEFAULT: colors.green[500],
          dark: colors.green[900],
        },
        purple: {
          light: colors.purple[100],
          DEFAULT: colors.purple[500],
          dark: colors.purple[900],
        },
        blue: {
          light: colors.blue[100],
          DEFAULT: colors.blue[500],
          dark: colors.blue[900],
        },
      },
      transitionProperty: {
        spacing:
          "margin, padding, width, height, min-width, min-height, max-width, max-height",
      },
      spacing: {
        "ryt-3xs": "var(--ryt-3xs)",
        "ryt-2xs": "var(--ryt-2xs)",
        "ryt-xs": "var(--ryt-xs)",
        "ryt-sm": "var(--ryt-sm)",
        ryt: "var(--ryt)",
        "ryt-lg": "var(--ryt-lg)",
        "ryt-xl": "var(--ryt-xl)",
        "ryt-2xl": "var(--ryt-2xl)",
        "ryt-3xl": "var(--ryt-3xl)",
        xs: "var(--xs)",
        sm: "var(--sm)",
        rg: "var(--rg)",
        md: "var(--md)",
        lg: "var(--lg)",
        xl: "var(--xl)",
      },
      minWidth: {
        "ryt-3xs": "var(--ryt-3xs)",
        "ryt-2xs": "var(--ryt-2xs)",
        "ryt-xs": "var(--ryt-xs)",
        "ryt-sm": "var(--ryt-sm)",
        ryt: "var(--ryt)",
        "ryt-lg": "var(--ryt-lg)",
        "ryt-xl": "var(--ryt-xl)",
        "ryt-2xl": "var(--ryt-2xl)",
        "ryt-3xl": "var(--ryt-3xl)",
        xs: "var(--xs)",
        sm: "var(--sm)",
        rg: "var(--rg)",
        md: "var(--md)",
        lg: "var(--lg)",
        xl: "var(--xl)",
      },
      maxWidth: {
        "ryt-3xs": "var(--ryt-3xs)",
        "ryt-2xs": "var(--ryt-2xs)",
        "ryt-xs": "var(--ryt-xs)",
        "ryt-sm": "var(--ryt-sm)",
        ryt: "var(--ryt)",
        "ryt-lg": "var(--ryt-lg)",
        "ryt-xl": "var(--ryt-xl)",
        "ryt-2xl": "var(--ryt-2xl)",
        "ryt-3xl": "var(--ryt-3xl)",
        xs: "var(--xs)",
        sm: "var(--sm)",
        rg: "var(--rg)",
        md: "var(--md)",
        lg: "var(--lg)",
        xl: "var(--xl)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("pointer-coarse", "@media (pointer: coarse)");
      addVariant("pointer-fine", "@media (pointer: fine)");
    }),
  ],
};
