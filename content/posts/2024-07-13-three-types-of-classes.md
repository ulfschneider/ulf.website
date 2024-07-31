---
title: Three types of CSS utility classes
tags:
  - code
  - css
draft: true
---
James Kerr identifies in his article [<cite> The 3 Types of CSS Utility Classes</cite>](https://www.jameskerr.blog/posts/3-types-of-css-utility-classes/) the following CSS class types:

- **Aesthetic classes**, like `.card`,  `.dialog`, `.menu`. They should not contain properties that are described by layout classes or by spacing classes.
- **Layout classes**, like `.center`, `.stack`, `.flow`. They define properties like display.
- **Spacing classes**, like `.gap-s`, `.gutter`. They define properties like gaps, paddings and margins.

I think what James calls aesthetic classes is named **components** in Tailwind and can be defined in a dedicated CSS file. I like to reuse spacing and layout classes within the components by using the Tailwind `@apply` keyword to *compose* higher level classes from existing classes. As well, the spacing classes can be reused in the same way to create more comfortable layout classes, e.g.:

```css
@layer utilities {
  /* center is a utility class and as such goes into the Tailwind utilities layer */
  .center {
    @apply mx-auto max-w-rg;
  }
}
```

From there, I typically reuse spacings and layouts to build up my components, like:

```css
@layer components {
  .demo-box {
    @apply center border border-meta p-0;
}
```
