---
title: Integrating Tailwind CSS with Eleventy
abstract: Use the `eleventy.before` configuration event to always have  a current CSS.
tags:
  - code
  - css
---
To integrate Tailwind CSS into my Eleventy build process I find it useful to leverage the  [`eleventy.before`](https://www.11ty.dev/docs/events/#eleventy-before) configuration event. This event is fired by Eleventy before the start of each build, even when using the Eleventy `--watch` and `--serve` options during development. 

I´m still using Tailwind CSS version 3, because other than version 4, it supports older browsers. Also, in the following example I´m using Eleventy version 3, but version 2 should work very similar.

Add Tailwind CSS to the dependencies of your Eleventy project:

```sh
npm i tailwindcss@3
```

Add the following code to your `eleventy.config.js`:

```js
//eleventy.config.js
import { execSync } from "node:child_process";

export default function (eleventyConfig) {

  //run the CSS preparation before each Eleventy build
  eleventyConfig.on(
    "eleventy.before",
    ({ dir, results, runMode, outputMode }) => {
      prepareTailwind();
    },
  );

  //generate the actual CSS for the website
  function prepareTailwind() {
    console.log("Prepare Tailwind CSS");
    execSync("npm run build:css", {
      cwd: "./",
      encoding: "utf-8",
      stdio: "inherit",
    });
  }

  //Whenever the generated CSS changes, copy the CSS to its final destination
  eleventyConfig.addPassthroughCopy({ "_code/_css/style.css": "css" });
  
  //and what else you want to configure
}
```

The function `prepareTailwind` is referencing an npm script named `build:css`,  which needs to be inside of the `scripts` section of your `package.json` file. In my case, the `build:css` script is running the `tailwindcss` command which is configured to take the file `_code/_css/main.css` as input, process it, minify it, and write the result to the file `_code/_css/style.css`.  Whenever that file changes, the passthrough copy that is configured in the `eleventy.config.js` will copy it to its final destination in the build output folder. That copied `style.css` file is the one that will be used during runtime of the project.

```json
"scripts": {
  "build:css": "npx tailwindcss --minify -i _code/_css/main.css -o _code/_css/style.css",
}
```

The input file, `_code/_css/main.css` imports all the styles I´ve created for my project (prefixed `@import`) and incorporates the Tailwind styles (prefixed `@tailwind`). In your project this file would likely look a little different.

```css
/* Styles I´ve added to my project, @imports must come first */
@import "colors";
@import "fonts";
@import "extend-base";
@import "extend-components.css";
@import "extend-utilities";
@import "forms";

/* Tailwind CSS styles */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

See below how my `tailwind.config.js` starts. I´m not scanning for Tailwind CSS classes inside of the `_code/_css/` folder. 

Because I´m using the npm packages `markdown-it-footnote` and `markdown-it-cooklang`  in my Eleventy project, I have safelisted the CSS classes containing the strings `footnote` or `cooklang` to make sure they are not purged by Tailwind during the CSS build. Safelisting is required for those classes because the content that refers to the CSS classes is generated during build time by `markdown-it-footnote` and by `markdown-it-cooklang`. The build time generation implies it is not available when `eleventy.before` runs. 

```js
//tailwind.config.js
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./_code/**/*",
    "!./_code/_css/**/*",
    "./content/**/*"
  ],
  safelist: [{ pattern: /footnote/ }, { pattern: /cooklang/ }],
  
  //and so on ...
```

Finally, make sure to link to the generated `styles.css` file by putting a reference link into the HTML head of your layout template:

```html
<head>
...
<link rel="stylesheet" href="/css/style.css" />
...
</head>
```

