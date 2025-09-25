---
title: Unknown at rules with Tailwind CSS in Zed
tags:
  - code
  - css
---
My Zed editor was complaining about unknown at rules (like `@apply`) when using Tailwind CSS. 

<figure>
<img src="/img/code/zed-unknown-at-rule.png" >
<figcaption>Unknown at rule @apply</figcaption>
</figure>

You can solve this issue by adding the following lines to your Zed `settings.json`:

```json
"languages": {
  "CSS": {
    "language_servers": ["tailwindcss-language-server"]
  }
}
```