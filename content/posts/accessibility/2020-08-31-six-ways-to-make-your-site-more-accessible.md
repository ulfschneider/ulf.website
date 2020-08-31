---
title: Six ways to make your site more accessible
refer: Summary of a talk given by Hidde de Vries
tags: reading
---
[Hidde de Vries](https://hiddedevries.nl/en/) made this enumeration in this [talk](https://talks.hiddedevries.nl/KhyueW/six-ways-to-make-your-site-more-accessible). Here is a quick summary:

[[toc]]

## Names
- Use link text that makes sense even out of context (avoid ambiguous link text such as multiple links on one page, all labeled "Read more", "Click here", "Continue")
- Give form fields a proper name by using a `<label>` tag.

~~~html
<label for="name">Name</label>
<input type="text" id="name" />
~~~

- Use `<caption>` for tables.

~~~html
<table>
  <caption>Financial results 2018<caption>
  <tbody>…</tbody>
</table>
~~~

- Use `<legend>` for fieldsets.

~~~html
<form>
  <fieldset>
    <legend>Personal details</legend>
    <label for="name">Name</label>
    <input type="text" id="name" />
		<!-- more fields here-->
  </fieldset>
</form>
~~~

## Markup
- Use `<a>` when the user is *send somewhere.*
- Consider `<button>` if the `href` attribute is empty. A `<button>` *does something.*
## Structure
- Give each page a unique `<title>`. 

<blockquote>The &lt;title&gt; is still the first guarantee or first confirmation that you´ve ended up on the page that you intended to reach.
<footer><a href="https://tink.uk">Léonie Watson</a>, accessibility expert and screenreader user</footer>
</blockquote>

- Provide proper headings, as they are like the table of contents for assistive technology.
- Have a sensible HTML structure. Check if the site is properly readable when CSS is turned off.
## Language
Define the language of the site `<html lang="en">`
## Text
The web is mostly text. Text will provide a lot of accessibility by default. Therefore use text or at least text alternatives, like `alt="…"`.
## Keyboard
Test the site navigation by using a keyboard only and check for [visible focus](/2020-08-27-indicate-focus).

## References
1. Hidde de Vries, [Six ways to make your site more accessible](https://talks.hiddedevries.nl/KhyueW/six-ways-to-make-your-site-more-accessible)
2. Léonie Watson, [tink](https://tink.uk)
3. WHATWG, [HTML: The Living Standard](https://html.spec.whatwg.org/dev/)