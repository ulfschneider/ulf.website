---
title: Composition and inheritance
tags: code
---
Steven Lowe has an article on the ThoughtWorks blog, elaborating on 	[<cite>Composition vs. Inheritance: How to Choose?</cite>](https://www.thoughtworks.com/insights/blog/composition-vs-inheritance-how-choose) The text covers examples of how to misuse inheritance.

> The purpose of composition is obvious: make wholes out of parts. 
> <footer>Steven Lowe</footer>

In my words: Use composition for *has-a* relationships.

> Inheritance captures semantics (meaning) in a classification hierarchy (a taxonomy), arranging concepts from generalized to specialized. […] This makes the subclass more tightly coupled to its superclass than it would be if it merely used an instance of the superclass as a component instead of inheriting from it. […] Inheritance captures mechanics by encoding the representation of the data (fields) and behavior (methods) of a class and making it available for reuse and augmentation in subclasses. Mechanically, the subclass will inherit the implementation of the superclass and thus also its interface.
> <footer>Steven Lowe</footer>

In my words: Use inheritance for *is-a* relationships.

Stevens guidance:

Inheritance should only be used when:
- Both classes are in the ==same logical domain==
- The subclass is a ==proper subtype== of the superclass
- The superclass’s implementation is ==necessary or appropriate== for the subclass
- The enhancements made by the subclass are ==primarily additive==.

