/** @type {import('tailwindcss').Config} */

import plugin from "./node_modules/tailwindcss/plugin.js";

export default {
  content: [
    "./_code/**/*",
    "!./_code/_css/**/*",
    "./content/**/*",
    "!./content/assets/**/*",
    "!./content/api/**/*",
  ],
  safelist: [
    { pattern: /footnote/ },
    { pattern: /cooklang/ },
    { pattern: /mermaid/ },
    { pattern: /chart-js/ },
  ],

  theme: {
    colors: {
      current: "currentColor",
      inherit: "inherit",
      transparent: "transparent",
      canvas: "var(--canvas)",
      write: "var(--write)",
      "code-canvas": "var(--code-canvas)",
      "code-write": "var(--code-write)",
      "mark-canvas": "var(--mark-canvas)",
      "mark-write": "var(--mark-write)",
      "button-canvas": "var(--button-canvas)",
      "button-write": "var(--button-write)",
      "active-button-canvas": "var(--active-button-canvas)",
      "active-button-write": "var(--active-button-write)",
      primary: "var(--primary)",
      meta: "var(--meta)",
      "field-canvas": "var(--field-canvas)",
      "field-write": "var(--field-write)",
      "select-canvas": "var(--select-canvas)",
      "select-write": "var(--select-write)",
      white: "white",
      black: "black",
      orange: "var(--orange)",
      red: "var(--red)",
      green: "var(--green)",
      purple: "var(--purple)",
      blue: "var(--blue)",
      yellow: "var(--yellow)",
    },
    spacing: {
      0: "0px",
      1: "1px",
      2: "2px",
      3: "3px",
      xs: "0.38rem",
      sm: "0.62rem",
      base: "1rem",
      md: "1.62rem",
      lg: "2.62rem",
      xl: "4.25rem",
      "2xl": "6.88rem",
      "3xl": "11.16rem",
      "4xl": "18.06rem",
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      base: 1.625,
      loose: 2,
    },
    fontSize: {
      sm: ["0.8rem", 1.625],
      base: ["1rem", 1.625],
      md: ["1.25rem", 1.5],
      lg: ["1.563rem", 1.375],
      xl: ["1.953rem", 1.25],
      "2xl": ["2.441rem", 1.25],
      "3xl": ["3.052rem", 1.25],
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
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("pointer-coarse", "@media (pointer: coarse)");
      addVariant("pointer-fine", "@media (pointer: fine)");
    }),
  ],
};
