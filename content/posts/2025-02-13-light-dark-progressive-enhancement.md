---
title: Using the `light-dark()` function to simplify light mode and dark mode CSS
tags:
  - code
  - css
  - accessibility
---
The [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) function is an excellent tool to simplify the handling of colors when a website should support light mode and dark mode. The function allows to decouple the colors of the two modes from the rest of your CSS and as such it is reducing CSS complexity! 

[[toc]]

## The basic idea

> The `light-dark()` CSS `<color>` function enables setting two colors for a property - returning one of the two colors options by detecting if the developer has set a light or dark color scheme or the user has requested light or dark color theme
> <footer>MDN</footer>

The idea is to assign the colors to be used in your CSS to custom properties, and then let the `light-dark()` function adjust the actual colors depending on the currently active color scheme. The subsequent CSS will access the custom properties and does not know whether two color schemes are supported, and even not if the `light-dark()` function is used at all.

```css
color-scheme: light dark; 
--canvas: light-dark(#f7f7f7, #171717); 
--write: light-dark(#262626, #c3c3c3);

/* use the defined colors without knowing whether two color modes are supported or not*/

body {
	background-color: var(--canvas);
	color: var(--write);
}

/* and so on ... */
```

## The problem

`light-dark()` is *in mainline*, which means the major browsers are supporting it, but not since long. According to [caniuse, the global support is currently at 87 % of browsers](https://caniuse.com/?search=light-dark), which is not too high. It would be great to use `light-dark()` as a progressive enhancement and have a fallback in case the users browser is not supporting it.

## The solution

The solution requires a little bit more code, but it is worth it to reach way more users. Credits go to Dave Rupert for his [<cite>quick light-dark() experiment<cite>](https://daverupert.com/2024/05/light-dark-experiment/)!

First, set the colors to be used when `light-dark()` is not supported:

```css
/* this CSS code will support only a single mode! **/
--canvas: #f7f7f7; 
--write: #262626;
```

Second, introduce `light-dark()` when the browser supports it. This code must come *after*  your color definition for the single mode.

```css
/* light-dark() is supported by 87% of browsers (2025-02-13)*/
@supports (color: light-dark(black, white)) {
    color-scheme: light dark;
    --canvas: light-dark(#f7f7f7, #171717);
    --write: light-dark(#262626, #c3c3c3);
    }
```

Browsers not supporting `light-dark()` will show your website in a single mode, others will show two modes. 

## Integrate into Tailwind CSS

The above code is functional on its own. You can go one step further in case Tailwind CSS is part of your current coding setup. By integrating the above approach into your Tailwind configuration you can avoid the use of the Tailwind `dark:` and `light:` variants, which will simplify the Tailwind code. You only have to use the previously introduced custom properties within your `tailwind.config.js` to tell Tailwind about your colors:

```js
export default {
  theme: {
    colors: {
      canvas: "var(--canvas)",
      write: "var(--write)",

//and so on
```

The colors are then applied to your HTML like:

```html
<body class="text-write bg-canvas">
<!-- and so on -->
</body>
```

## Conclusion

Using `light-dark()` as a progressive enhancement, like shown, allows to reach more users and simplifies the setup of colors for light mode and dark mode. It even provides a central point in your code to adjust the colors without affecting the rest of the CSS. When integrating the approach into Tailwind CSS, the resulting Tailwind code is simplified because the `dark:` and `light:` variants can be omitted.