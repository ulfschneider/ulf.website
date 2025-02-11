/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";

export default {
  content: ["./_code/**/*", "./content/**/*"],
  theme: {
    colors: {
      current: "currentColor",
      inherit: "inherit",
      transparent: "transparent",
      canvas: "light-dark(#f7f7f7,#171717)",
      write: "light-dark(#262626,#c3c3c3)",
      "code-canvas": "light-dark(#ddd,#333)",
      "button-canvas": "light-dark(#262626,#c3c3c3)",
      "button-write": "light-dark(white,black)",
      "active-button-canvas": "light-dark(#007aff,#007aff)",
      "active-button-write": "white",
      primary: "light-dark(#007aff,#007aff)",
      meta: "light-dark(#777,#999)",
      field: "light-dark(white, #272727)",
      select: "#007aff",
      white: "white",
      black: "black",
      orange: "light-dark(orange, orange)",
      red: "light-dark(red, red)",
      green: "light-dark(green, green)",
      purple: "light-dark(mediumpurple, mediumpurple)",
      blue: "light-dark(#007aff,#007aff)",
      yellow: "light-dark(gold, gold)",
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
