---
title: Design systems for everyone
tags: [design, css, courses, star]
---
Ethan Marcotte has [four new courses on design systems](https://thegymnasium.com/design-systems), available for free at Aquent Gymnasium. These are my notes about the excellent first course, [<cite>Design systems for everyone</cite>](https://thegymnasium.com/design-systems#everyone).

[[toc]]

## Introduction

- Design systems bring *structure* and *purpose* to design patterns. 
- Design systems help to make patterns more visible and more organized. 
- Design systems can help make our products more manageable and consistent. 
- *Design systems can help to communicate more clearly.*

## What is a design system

Examples:

- [Olympic Games 1972 Munich, by Otl Aicher](https://www.munich72collected.com/)
- [Mailchimp](https://ux.mailchimp.com/patterns)
- [IBM Carbon Design System](https://carbondesignsystem.com)
- [Starbucks Pattern Library](https://starbucks.com/developer/pattern-library) complemented by [Our new expression](https://creative.starbucks.com)
- [Salesforce Lightning Design System](https://lightningdesignsystem.com)
- Further information at [Alla Kholmatova](https://craftui.com)
    
A design system consists of patterns & components as well as guidelines how to work with those patterns.

<figure>
<img src="/img/design/what-is-a-design-system.png" alt="A slide from Ethan Marcotte´s course on design systems, showing two intersected circles, one containing the text 'design patterns & components', the other 'how to work with them'. That´s what a design system is.">
<figcaption>A slide from Ethan Marcotte´s course <em><a href="https://thegymnasium.com/design-systems#everyone">Design systems for everyone</a></em>, showing what a design system is about.</figcaption>
</figure>

## Why do we need design systems

- *Design patterns* are reusable pieces of interface design.
- A *pattern library* is a well-structured and accessible collection of patterns. Often managed by software such as Storybook, Pattern Lab, or Fractal. A *good* pattern library meets the needs of the people using it. It has to be *accessible to them.* Which means it has to be organized, categorized, and navigable. Also, *teams have to be able to contribute to the pattern library.*

A design system provides *designers, developers, and product managers* a shared language to improve on the following things:

- design standards
- consistency
- less redundancy
- an extensible system
- documentation
- coding standards
- improved shipping times

A design system is a way to improve the way your team works.

## Conducting a pattern library

- A design pattern is a reusable piece of design.
- Have a conversation about the purpose of the patterns.

## Naming and organizing design patterns

A good pattern name should describe the patterns by purpose or function, not by their appearance. Examples:

- *Featured teaser card*
- *Teaser card*
- *Teaser*

Language is the primary interface for design patterns.

See a workshop format by Charlotte Jackson that can be used with customers. Its documented in the alistapart article [From Pages to Patterns: An Excercise for Everyone](https://alistapart.com/article/from-pages-to-patterns-an-exercise-for-everyone). It goes:

1. Visual inventory of patterns
	- Cut up each page of your website into its smallest elements (paper!)
	- Group similar elements
	- Remove duplicates
2. Name patterns
	- Pick an element
	- Each person in the group writes a name for it (focus on function, not looks)
	- Names are secret until they are revealed
	- Compare and discuss in the group
	- Repeat for each component
	- Structure the patterns into *categories,* because that is the *primary* interface for *finding* the patterns. Example: [Marvelapp Styleguide](https://marvelapp.com/styleguide/overview/introduction) under components. Alternatively look at [DFPB Design System](https//cfpg.github.io/design-system/).

This is how a shared language can emerge from the design patterns

## Creating a pattern library

This is three-step process and the first two steps are done:

1. Create a pattern inventory (done)
2. Name and group patterns (done)
3. Building the library

Approaches:

- Use static HTML – This is for smaller systems.
- Use [storybook.js.org](https://stprybook.js.org).
- Use [fractal.build](https://fractal.build)

## Evolving a pattern library into a design system

<blockquote>A design sytem is a set of <em>interconnected patterns</em> and <em>shared practices</em> coherently organized to serve the purpose of a digital product.<footer>Alla Kholmatova</footer></blockquote>

<figure>
<img src="/img/design/design-system-patterns-and-practices.png" alt="A slide from Ethan Marcotte´s course on design systems, showing two intersected circles, one containing the text 'interconnected patterns', the other 'shared practices'. That´s what a design system is.">
<figcaption>A slide from Ethan Marcotte´s course <em><a href="https://thegymnasium.com/design-systems#everyone">Design systems for everyone</a></em>, using an alternate wording of what a design system is about.</figcaption>
</figure>

## Defining the shape of a design system

Answer the question for yourself: **Why are you building a design system?** The purpose of a design system is defined by its *audience* and its *direction*.

1. To *define the direction* of the design system, as a group, ask **early in the process**:
	- How will we know if our design system is successful?
	- How will we know if this is working?
2. Dedicate time to explore the needs of the design system´s *audience*.
	- Who will create the design system?
	- Which product/s will use the design system?
	- Who will be the system´s *contributors* and its *consumers*?
	- How and why will they be using the design system?
3. You know things are working, if
	- Consumers are shipping features based on the design system.
	- You´re getting regular feedback from contributors and consumers.
	- The maintainers of the system have established a regular pace of updates.
	- Consumers and contributors have begun sharing best practices and resources.

A good design system is aligned with the needs of a product as well as the needs of the people working with it.

Visit *[A design system isn´t a project. It´s a product, serving products](https://link.medium.com/PmAeEzHgR9)*, by Nathan Curtis.

## Common myths about design systems

1. *We need to start our design system from scratch.*
	- You already have a design system!
	- Your product already has (uninventoried) patterns and your team has existing (albeit not ideal) practices.
	- **Start by inventoring what exists, in order to understand how to proceed.**
2. *We have to roll out the entire design system at once.*
	- Design system work is slow and iterative.
	- It´s okay to release it in a gradual cadence.
	- **Consider shipping revised components as they are ready, redisigning your product´s interface little by little.** See *[The hardest thing about design systems](https://robinrendle.com/notes/the-hardest-thing-about-design-systems)*, by Robin Rendle.
3. *That other organization makes design system work look so easy.*
	- The pattern library for the design system is just the artifact. You´re not seeing the work that goes into it.
	- **Every design system has failed.**
	- It´s important for teams to be able to identify problems and discuss openly to adjust and proceed.
4. *We´ll launch our design system, and then we´ll basically be done.*
	- A design system isn´t a project, it´s a product.
	- **Design systems work is never finished, they are evolving ecosystems. And that´s good!** See *[Building a visual language](https://airbnb.design/building-a-visual-language)*.

## Further Reading
[<cite>Design Systems</cite>](https://shop.smashingmagazine.com/products/design-systems-by-alla-kholmatova), by Alla Kholmatova










