---
title: Accessible names and descriptions
tags: accessiblity
---
How to name a `label` (for example) to make it effective from an accessibility standpoint: ARIA Authoring Practice Guide has a section [<cite>Providing Accessible Names and Descriptions</cite>](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/) to focus on that. [Hidde de Vries is a fan](https://hidde.blog/better-accessible-names/) of that document.

I´m quoting the complete section *Composing Effective and User-friendly Accessible Names*:

For assistive technology users, especially screen reader users, the quality of accessible names is one of the most significant contributors to usability. Names that do not provide enough information reduce users' effectiveness while names that are too long reduce efficiency. And, names that are difficult to understand reduce effectiveness, efficiency, and enjoyment.

- Convey function or purpose, not form. For example, if an icon that looks like the letter "X" closes a dialog, name it "Close", not "X". Similarly, if a set of navigation links in the left side bar navigate among the product pages in a shopping site, name the navigation region "Product", not "Left".
- Put the most distinguishing and important words first. Often, for interactive elements that perform an action, this means a verb is the first word. For instance, if a list of contacts displays "Edit", "Delete", and "Actions" buttons for each contact, then "Edit John Doe", "Delete John Doe", and "Actions for John Doe" would be better accessible names than "John Doe edit", "John Doe delete", and "John Doe actions". By placing the verb first in the name, screen reader users can more easily and quickly distinguish the buttons from one another as well as from the element that opens the contact card for John Doe.
- Be concise. For many elements, one to three words is sufficient. Only add more words when necessary.
- Do NOT include a WAI-ARIA role name in the accessible name. For example, do not include the word "button" in the name of a button, the word "image" in the name of an image, or the word "navigation" in the name of a navigation region. Doing so would create duplicate screen reader output since screen readers convey the role of an element in addition to its name.
- Create unique names for elements with the same role unless the elements are actually identical. For example, ensure every link on a page has a different name except in cases where multiple links reference the same location. Similarly, give every navigation region on a page a different name unless there are regions with identical content that performs identical navigation functions.
- Start names with a capital letter; it helps some screen readers speak them with appropriate inflection. Do not end names with a period; they are not sentences.
