---
title: JetBrains Mono
tags: [font, code]
---
JetBrains Mono is my coding font and it has been for years. It´s easy enough to configure VSCode to use the font. What I noticed when switching to a different machine, where this font is not installed, I´m immediately missing the super nice ligatures, which are <q>to reduce noise by merging symbols and removing details so the eyes are processing less.</q> The font is free of charge, for both commercial and non-commercial purposes. You can download it at the beautiful [JetBrains Mono Homepage](https://www.jetbrains.com/lp/mono/). Take the time to stray around and explore the features and the comparisons with other fonts. There is a [JetBrains Mono GitHub Repo](https://github.com/JetBrains/JetBrainsMono) which explains more ways to install.

When configuring your VSCode to use JetBrains Mono, do not forget to activate ligatures for your editor, which you have to do in the `settings.json`. E.g.: my settings.json contains the following entries:

```json
"editor.fontFamily": "'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace",
"editor.fontSize": 14,
"editor.fontLigatures": true,
"terminal.integrated.fontSize": 14
```

<figure>
<img src="/img/fonts/jetbrains-mono-ligatures.gif" alt="A black backgrounded animated gif displaying white JetBrains Mono ligatures vs. white non-ligatures">
<figcaption>JetBrains Mono Ligatures</figcaption>
</figure>

<figure>
<img src="/img/fonts/jetbrains-mono-character-set.png" alt="The character set of JetBrains Mono in white font color on black background">
<figcaption>Basic character set of JetBrains Mono</figcaption>
</figure>
