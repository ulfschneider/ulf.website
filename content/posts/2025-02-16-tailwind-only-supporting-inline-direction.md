---
title: Tailwind CSS is supporting logical inline direction, but not logical block direction properties
tags:
  - code
  - til
---
According to [pull request 10166](https://github.com/tailwindlabs/tailwindcss/pull/10166) the logical block direction is currently not supported by Tailwind CSS because it would introduce naming collisions and is considered by Adam Wathan to have far less benefits in practice than the inline direction. Logical inline direction, which is required to properly react to LTR and RTL content, *is* supported. Read about LTR/RTL in the [MDN Glossary](https://developer.mozilla.org/en/docs/Glossary/LTR).


