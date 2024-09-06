---
title: Adding <code>pointer-coarse</code> and <code>pointer-fine</code> variants to tailwindcss
tags:
  - code
  - css
---
There is a super quick way of adding media variants to your tailwindcss setup.

Go to your `tailwind.config.js` and add the import

```js
const plugin = require("tailwindcss/plugin");
```

or, alternatively

```js
import plugin from 'tailwindcss/plugin'
```

Then, add the following to your configuration:

```js
 plugins: [
    plugin(function ({ addVariant }) {
      addVariant("pointer-coarse", "@media (pointer: coarse)");
      addVariant("pointer-fine", "@media (pointer: fine)");
    }),
  ]
```

Now you can do something like in the below example, where the indication of a keyboard navigation is hidden for devices that have only a *coarse* pointer device (your finger). 

```html
 <div class="text-sm whitespace-nowrap">
  <span>Newer post</span><span class="pointer-coarse:hidden"> <kbd>-</kbd></span>
</div>
```

> [!Note]
> For the above example it´s assumed you do not have a physical keyboard when you have a *coarse* pointer device. Unfortunately it is not possible to detect with a media query if a physical keyboard is attached to your computer. A *fine* pointing device (your mouse, a touchpad) increases chances of having a physical keyboard.