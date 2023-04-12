---
title: My first attempt with Tailwind CSS
tags: [code, css]
---
During the recent weeks I switched the CSS for *{{site.hostname}}* to [Tailwind CSS](https://tailwindcss.com). One of the key concepts of Tailwind is the *utility-first* approach for CSS classes. I think utility classes are not invented by Tailwind. Years ago, tools like [Tachyons](http://tachyons.io) were already onto it. The difference of Tailwind is, in my view, the configuration options and the ease of use have been brought to a new level, which can make you very quick. 

Also, Tailwind is not *only* utility-first. You can have CSS component classes that go beyond utility-first. You build them by reusing utility classes, injecting them into your component class with the `@apply` keyword. The concept makes you write less CSS, that is more consistent. The layers for extending the system, `@layer base`, `@layer components`, and `@layer utilities`, as well as the `tailwind-config.js` file, provide a skeleton that makes sense to me and is easy to build upon. I know Tailwind is polarizing people, but I can say I enjoy working with Tailwind.

[[toc]]

## Utility CSS classes

Utility classes mean *self-descriptive, single-purpose CSS classes*, like for: 

- Text sizes, colors, and weights
- Border colors, widths, and positions
- Background colors
- Flexbox and grid utilities
- Filters
- Padding, width, and margin helpers

Look at the following example: 

```html
<p class="px-ryt-lg py-ryt">
Here is my paragraph, it has padding on all sides.
</p>
```

Read the two CSS class names of the example as:

`px-ryt-lg`
: Padding for the x-axis (left padding and right padding) with a large horizontal rhythm.

`py-ryt`
: Padding for the y-axis (top padding and bottom padding) with a regular vertical rhythm.

We do not need to know the exact values of *large rhythm* and *regular rhythm* by now, because you would configure these to the needs of your project.

I find utility classes especially useful in conjunction with *media variants.* A media variant will reflect on things like screen size, dark mode, or light mode. In the following example, the *variant* classes give more padding on large screens (more accurate: large browser windows) and less padding on smaller screens:

```html
<p class="px-ryt-lg py-ryt lg:px-ryt-xl lg:py-ryt-lg">
Here is my paragraph, it has padding on all sides. The padding will be wider on large screens.
</p>
```

There are two new classes:

`lg:px-ryt-xl`
: For a large browser window and above (`lg:`), use extra-large horizontal rhythm padding for the x-axis.

`lg:py-ryt-lg`
: For a large browser window and above (`lg:`), use large vertical rhythm padding for the y-axis.

You will set the exact value of a large browser window according to the need of your project. It might be a width of 1280px, less, or more. For browser windows of a width below that value, the utility classes that are not prefixed by a variant identifier will be used, which are `px-ryt-lg`, and `py-ryt`.

## The implementation of utility classes

Below is an example showing how the above utility classes can be implemented with CSS. It starts with the non-variant classes `px-ryt` and `py-ryt-lg`, followed by the variant classes that come into play only for large browser windows, `lg:px-ryt-lg`, and `lg:py-ryt-xl`. It´s important to keep this order of classes for your CSS to function properly – variant classes come after non-variant classes.

```css
.px-ryt { 
	/*regular horizontal padding ryhthm */
	padding-left: 1rem;
	padding-right: 1rem;
}

.py-ryt-lg { 
	/* large vertical padding rhythm */
	padding-top: 1.62rem;
	padding-bottom: 1.62rem;
}

/*CSS classes for screen variants */
@media screen and (min-width: 1280px) {
	/* a large screen is wider than 1280px*/
	.lg\:px-ryt-lg { 
		/*the backslash \ in the class name 
		allows to use the colon as a part of the name*/

		/*large horizontal padding ryhthm */
		padding-left: 1.62rem;
		padding-right: 1.62rem;
	}

	.lg\:py-ryt-xl { 
		/*the backslash \ in the class name 
		allows to use the colon as a part of the name*/

		/* x-large vertical padding rhythm */
		padding-top: 2.62rem;
		padding-bottom: 2.62rem;
	}
}
```

## Adjusting Tailwind

The thing with utility-first CSS frameworks, like Tachyons or Tailwind, is, you do not have to write the utility classes by yourself. The framework has them already predefined. Tailwind has a very nice mechanism with the `tailwind-config.js` file, to quickly adapt the system to your needs. You can define your screen sizes (`400px`, `600px`, …) and the variant prefixes (`xs`, `sm`, …) to address the screen sizes in your code, like follows:

```js
//tailwind-config.js
//...
theme: {
    screens: {
      'xs': '400px',
      'sm': '600px',
      'rg': '800px',
      'md': '1024px',
      'lg': '1280px',
      'xl': '1563px'
    }
}
//...
```

You can also decide to extend, or to overwrite the default settings. For example, by default, Tailwind doesn´t have spacing classes named `px-ryt-lg`. Instead, Tailwind has classes named `px`, `px-1`, `px-2`. Because I like the idea of vertical rhythm and horizontal rhythm reflected in my utility class names, I can easily extend Tailwind with a short section like the one below, and Tailwind will generate all the utility classes for padding, margin, and width, during the build of the website.

```js
//tailwind-config.js
//...
extend: {
  spacing: {
    'ryt-3xs': '0.15rem',
    'ryt-2xs': '0.23rem',
    'ryt-xs': '0.38rem',
    'ryt-sm': '0.62rem',
    'ryt': '1rem',
    'ryt-lg': '1.62rem',
    'ryt-xl': '2.62rem',
    'ryt-2xl': '4.25rem',
    'ryt-3xl': '6.88rem',
  }
}
//...    
```

The CSS code will be optimized by Tailwind during the build, so hat only those CSS classes remain in the final CSS that are really used in the resulting HTML, which makes the final CSS as small as possible. The content settings in the `tailwind-config.js` allow to define where Tailwind should investigate for possible use of CSS classes:

```js
//tailwind-config.js
//...
  content: {
    relative: true,
    files: ['content/pages/**/*',
      'content/posts/**/*',
      'content/tagintros/**/*',
      '_includes/**/*',
      '_layouts/**/*',
      '_eleventy/**/*',
      '_assets/js/**/*']
  }
//...
```

In the example above, folders that start with an underscore (_) contain HTML or JavaScript and folders not starting with an underscore hold the content of the website. All of those folders will be analyzed by Tailwind for the usage of CSS.

## The evolution of Tailwind

Adam Wathan, the creator of Tailwind, explains what made him prefer utility classes over specialized content-component classes in his article [<cite>CSS Utility Classes and "Separation of Concerns"</cite>](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)^[[<cite>CSS Utility Classes and "Separation of Concerns"</cite>](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)], dating back to the year 2017. In that text, Adam describes, how his way of developing web pages evolved:

**Phase 1: Write semantic HTML that is not concerned with styling decisions.** Let the CSS follow the HTML structure. This leads to CSS being tightly coupled to the HTML, even becoming a mirror of the HTML structure. It might happen that only a single CSS class representing a component will be assigned to the HTML. Adam doesn´t explain in his article why that could be a problem. A typical CSS during that phase looks like:

```css
.author-bio {
  background-color: white;
  border: 1px solid hsl(0,0%,85%);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  > img {
    display: block;
    width: 100%;
    height: auto;
  }
  > div {
    padding: 1rem;
    > h2 {
      font-size: 1.25rem;
      color: rgba(0,0,0,0.8);
    }
    > p {
      font-size: 1rem;
      color: rgba(0,0,0,0.75);
      line-height: 1.5;
    }
  }
}
```

**Phase 2: Reduce the coupling of the CSS and the HTML.** This leads to using more CSS classes with a more narrowed down purpose. The approach allows to change single classes more directly with less dependencies to other CSS classes. It also reduces [selector specifity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)^[[CSS Selector Specifity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)]. The CSS will now look like:

```css
.author-bio {
  background-color: white;
  border: 1px solid hsl(0,0%,85%);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}
.author-bio__image {
  display: block;
  width: 100%;
  height: auto;
}
.author-bio__content {
  padding: 1rem;
}
.author-bio__name {
  font-size: 1.25rem;
  color: rgba(0,0,0,0.8);
}
.author-bio__body {
  font-size: 1rem;
  color: rgba(0,0,0,0.75);
  line-height: 1.5;
}
```

The question arises, how to handle the decoupled CSS in situations, where components that are semantically not the same should receive an identical styling? For example, an author bio component and an article preview component. These components could be styled identically to  communicate consistency for the website, while they are semantically not the same. Adam describes three possible options:

1. **Duplicate styles:** You will have additional styles for the article preview with different names and adjusted styling. The styling of `author-bio` will be duplicated into `article-preview`, `author-bio__image` will be duplicated into `article-preview__image`, and so on. You end up having a lot of redundant code that opens the door for the components to unwantedly differ slightly over time.
2. **@extend the `author-bio`:** Use a CSS preprocessor to inherit the `author-bio` styles into the `article-preview` styles to remove a lot of the duplication, like:

	```css
	.article-preview {
	  @extend .author-bio;
	}
	.article-preview__image {
	  @extend .article-preview__image;
	}
	/*and so on*/
	```

3. **Create a content-agnostic component:** Have a new component named after what the author bio and the article preview do have in common, and reuse that component for both types of content. The new component could be named `media-card`. This removes the CSS duplication entirely.

As a conclusion, Adam states, there are two ways you can write HTML and CSS:

1. Write CSS that depends on HTML. The HTML is independent. It doesn´t care how you make it look. In this model, your HTML is restyleable, but your CSS is not reusable, because CSS will be very concerned with the HTML structure. This is the approach of the [CSS Zen Garden](http://www.csszengarden.com)^[[<cite>CSS Zen Garden</cite>](http://www.csszengarden.com)].
2. Write HTML that depends on CSS. The CSS is independent. It doesn´t care what content it is being applied to. In this model, your CSS is reusable, but your HTML is not restyleable. This is the approach of UI frameworks like [Bootstrap](https://getbootstrap.com/)^[[<cite>Bootstrap</cite>](https://getbootstrap.com/)] or [Bulma](https://bulma.io)^[[<cite>Bulma</cite>](https://bulma.io)].

The first approach will focus on restyleable HTML, the second on reusable CSS. 

> The approach of Tailwind is to have reusable CSS with minimal, content-agnostic CSS classes, and variant-prefixed utility classes.

The most reusable components are those with class names that are independent of the content. Not having class names rigidly reflect specific content doesn’t make classes unsemantic, it just means that their semantics are not derived from the content.^[Adam Wathan refers to [<cite>About HTML semantics and front-end architecture</cite>](https://nicolasgallagher.com/about-html-semantics-front-end-architecture/), by Nicolas Gallagher, dating back to March 2012, to explain his preference for reusable CSS] When it´s necessary to create a new component class with Tailwind, it can quickly be composed out of utility classes by leveraging the `@apply` keyword. The below example will introduce a `btn-purple` component for styling buttons, with a purple background, white text color and regular horizontal and vertical padding. The embedding into  `@layer components` ensures the CSS is ordered by Tailwind with base styles first, like for `h1`, `h2`, `p`, followed by components like `btn-purple`, and then followed by utility classes like `bg-purple`, `text-white`, `p-ryt`.

```css
@layer components {
	.btn-purple {
		/* a component class for a purple button */
		@apply bg-purple text-white p-ryt;
	}
}
```

Tailwind provides three layers to introduce adjustments: `@layer base`, `@layer components`, and `@layer utilities`. The components layer and the utilities layer are meant to extend the system with new CSS classes that serve a purpose as a component, or as a utility class.

The utility classes are not just *inline styles*, like below:

```html
<p style="padding-top: 1.62rem; padding-bottom: 1.62rem; padding-left:1rem; padding-right:1rem;">
Here is my paragraph, it has padding on all sides.
</p>
```

Instead the notation of the Tailwind utility classes is shorter and you can choose only from a curated list of utility classes that are centrally configured. I understand it as a utility layer of your design system.

Following this approach, I think, the reusability of the CSS not only makes you write less code. The reduced amount of code and the predefined set of utility classes, that you tailor to your needs, increases the chances of the styling to be more consistent and quicker to change. Utility classes have a clear purpose that should help everyone in the team using them consistently. In my view the combination of utility classes, the possibility to create components by inheriting styles with the `@apply` keyword, the hierarchy provided by the layers (`@layer`), and the ease of adjustment through the `tailwind-config.js`, is something that works.

## What I like about Tailwind

- Tailwind is quick to setup and easy to tailor with your own definition of colors, screen sizes, fonts, font sizes, line heights, and spacing rhythm. In my view it makes an excellent technical starting point for a design system. It´s easy to override the Tailwind defaults, or to add styles to the existing defaults. All of this is possible within the `tailwind-config.js`.
- The level of automation is great. Only some lines of code in the `tailwind-config.js` can transform Tailwind into a CSS system that works exactly to your needs.
- The documentation site is accurate and to the point.
- With [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) you can have Tailwind-specific autocomplete, syntax highlighting, color indication, and linting in your VS Code IDE. Have a look at [Editor Setup](https://tailwindcss.com/docs/editor-setup) to get more options.
- I like the short `@apply` notation very much, which allows to inherit existing styles into new components. It´s quick to work with and it makes you write much less CSS. The combination of variant-controlled utility classes that can inherit their styles into components, or that can be used on their own within your HTML is a productive combination. 
- I like the naming of the utility classes. E.g. you have a `ml-2` class to assign a *left margin sized 2*. It´s short and easy to remember. I like especially, if you want a negative left margin, you use a CSS class named `-ml-2`.
- I was using the default colors that come with Tailwind. They are already pretty nice. Of course you can adjust that easily. Use a tool like [Primer Prism](https://primer.style/prism/)^[[<cite>Accelerating GitHub theme creation with color tooling</cite>](https://github.blog/2022-06-14-accelerating-github-theme-creation-with-color-tooling/)] to define your colors, and [apply the colors it to Tailwind](https://tailwindcss.com/docs/customizing-colors)^[[<cite>Customizing Colors</cite>](https://tailwindcss.com/docs/customizing-colors), Tailwind documentation]. The Tailwind documentation recommends [Palette](https://palettte.app), or [Colorbox](https://colorbox.io) for the same.
- The resulting CSS is small because of the built-in optimization (CSS purging).

## What might be a problem with Tailwind

- I think you need to have a proper understanding of CSS before using Tailwind. 
- I find myself often googling for how to exactly do a thing with Tailwind, when I already know how I would do it with pure CSS, because the naming of the Tailwind utility classes is sometimes ever-so-slightly different. It´s not a real issue for me, and it is quick. Typically your first search hit directly brings you to the correct page of the Tailwind documentation. However, I understand it can irritate, or make the handling your styles initially more difficult.
- It´s better to have a componentization concept for your HTML, otherwise you might duplicate combinations of your utility first classes into several locations in your HTML, which can become difficult to maintain.
- Once you have Tailwind in your system, at some point it might be difficult to move away from it.

## Conclusion

I enjoy working with Tailwind. It makes me more productive and leads to beautiful results. The tool is well thought through and well built. It´s a workhorse in my view. 