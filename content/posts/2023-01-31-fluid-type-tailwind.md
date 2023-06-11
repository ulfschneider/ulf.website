---
title: Fluid type with Tailwind CSS
tags: [fonts, code, css]
draft: true
---
Fluid type allows the fonts on your website to smoothly reduce size when the browser window gets smaller and to enlarge size when the browser window gets wider. The transition will not go beyond a minimum and a maximum size to avoid extreme font sizes that wouldn´t be legible.

I´m using the [<cite>Fluid Type Scale Calculator</cite>](https://www.fluid-type-scale.com) by Aleksandr Hovhannisyan to define my fluid type scale and apply it for *{{site.hostname}}*. Because the website´s CSS is realized with Tailwind CSS, I had to integrate the output of Aleksandr´s type scale calculator into my Tailwind setup. This text is a short description of what I did to achieve that.

## Type scale

I have a file named `type-scale.css`, storing the scale calculation as the output of the Fluid Type Scale Calculator, copied and pasted, plus, in the second half, some custom CSS variables added by me.

```css
/* type-scale.css */

/* Output of the fluid type scale calculator */

/* Fluid font size variables, for browsers that support clamp */
@supports (font-size: clamp(1rem, 1vw, 1rem)) {
  :root {
    --font-size-sm: clamp(0.99rem, 0.22vw + 0.94rem, 1.15rem);
    --font-size-base: clamp(1.19rem, 0.26vw + 1.12rem, 1.38rem);
    --font-size-lg: clamp(1.43rem, 0.31vw + 1.35rem, 1.65rem);
    --font-size-xl: clamp(1.71rem, 0.37vw + 1.62rem, 1.98rem);
    --font-size-2xl: clamp(2.05rem, 0.45vw + 1.94rem, 2.38rem);
    --font-size-3xl: clamp(2.46rem, 0.54vw + 2.33rem, 2.85rem);
    --font-size-4xl: clamp(2.95rem, 0.64vw + 2.79rem, 3.42rem);
    --font-size-5xl: clamp(3.55rem, 0.77vw + 3.35rem, 4.11rem);
  }
}
/* Fallback variables for browsers that don't support clamp */
@supports not (font-size: clamp(1rem, 1vw, 1rem)) {
  :root {
    --font-size-sm: 0.99rem;
    --font-size-base: 1.19rem;
    --font-size-lg: 1.43rem;
    --font-size-xl: 1.71rem;
    --font-size-2xl: 2.05rem;
    --font-size-3xl: 2.46rem;
    --font-size-4xl: 2.95rem;
    --font-size-5xl: 3.55rem;
  }
  @media screen and (min-width: 1560px) {
    :root {
      --font-size-sm: 1.15rem;
      --font-size-base: 1.38rem;
      --font-size-lg: 1.65rem;
      --font-size-xl: 1.98rem;
      --font-size-2xl: 2.38rem;
      --font-size-3xl: 2.85rem;
      --font-size-4xl: 3.42rem;
      --font-size-5xl: 4.11rem;
    }
  }
}

/* Below lines are not created by the type scale calculator.
They are added by me. */

/* The link contains the exact settings
of my type scale for the type scale calculator.
I´m always adding this link, to have a quick
back-reference  into the type scale calculator
with current settings of the scale I´m using. */

/* https://www.fluid-type-scale.com/calculate?minFontSize=19&minWidth=400&minRatio=1.2&maxFontSize=22&maxWidth=1560&maxRatio=1.2&steps=sm%2Cbase%2Clg%2Cxl%2C2xl%2C3xl%2C4xl%2C5xl&baseStep=base&prefix=font-size&decimals=2&includeFallbacks=on&useRems=on&remValue=16&previewFont=IBM+Plex+Mono*/

:root {
  --ryt-3xs: calc(var(--font-size-base) * 0.1);
  --ryt-2xs: calc(var(--font-size-base) * 0.19);
  --ryt-xs: calc(var(--font-size-base) * 0.32);
  --ryt-sm: calc(var(--font-size-base) * 0.57);
  --ryt: var(--font-size-base);
  --ryt-lg: calc(var(--font-size-base) * 1.75);
  --ryt-xl: calc(var(--font-size-base) * 3);
  --ryt-2xl: calc(var(--font-size-base) * 5.35);
  --ryt-3xl: calc(var(--font-size-base) * 9.3);
  --xs: calc(var(--font-size-base) * 16);
  --sm: calc(var(--font-size-base) * 26);
  --rg: calc(var(--font-size-base) * 36);
  --md: calc(var(--font-size-base) * 46);
  --lg: calc(var(--font-size-base) * 58);
  --xl: calc(var(--font-size-base) * 70);
}
```

I have a `main.css` file, which contains all the CSS file imports necessary for my project. The necessary CSS files are in the same folder:

```css
@import "fonts";
@import "type-scale"; /*here is the type scale*/
@import "tailwindcss/base";
@import "tailwind-extend-base";
@import "tailwindcss/components";
@import "tailwind-extend-components";
@import "tailwindcss/utilities";
@import "tailwind-extend-utilities";
@import "forms";
```



## Tailwind configuration

To have the type scale reflected within the Tailwind ecosystem, I added the following section, which is picking up the custom CSS variables from the type scale definition, to the `tailwind-config.js`:

```js
//tailwind-config.js

theme: {
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
	//...
```

This leads to Tailwind preparing CSS utility classes like `text-sm`, `text-base`, and so on, during the build. The utility classes will carry the corresponding font sizes and line heights.
