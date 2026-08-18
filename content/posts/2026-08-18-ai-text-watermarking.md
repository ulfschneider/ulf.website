---
title: How AI text watermarking works
tags: journal
bookmark: true
---
[<cite>How AI text watermarking works</cite>](https://declaude.org/watermarking/) by James Padolsey is an exceptionally readable explanation. Only the holder of the key that was used to place the watermark can detect it! James also makes the [<cite>declaude.org</cite>](https://declaude.org) tool, where you can paste in AI flavoured text and get back the same content as plain prose.

> [Watermark] detection is private, probabilistic, and about processing, not authorship.
> - Only the key-holder can check. Your teacher, editor, or favourite "AI detector" website cannot run this test; a genuine check needs the provider's secret key, or a checking service the provider runs. Google runs an early-access detector portal for SynthID; Anthropic says detection tooling is forthcoming.
> - A watermark check is not an "AI detector." Tools like GPTZero guess from style and are famously unreliable. A watermark is the opposite: a deliberate, key-gated statistical test. Don't let the two blur.
> - A found mark means "processed by", not "written by". Anthropic's own documentation notes that human text merely proofread or translated by Claude picks up the mark. And absence proves even less: old models or heavy editing yield clean results on genuine AI text.
> - Short and low-choice text carries little mark. Evidence grows with length, and text with only one right continuation (code, quotations, lists of facts) offers the dice too little slack to hide anything in.
> - Certain marks outlive a rewrite. Schemes keyed on the word itself rather than its neighbours hold up far better: a same-meaning rewrite keeps enough of the words that much of the mark survives. (Their weakness is different: a colouring reused everywhere can be reverse-engineered from enough output.) Others hide in the meaning, and a same-meaning rewrite partly preserves them; the only answer we know there is outline-level regeneration.
> <footer>Written by <a href="https://j11y.io ">James Padolsey</a> on <a href="https://declaude.org/watermarking/">declaude.org/watermarking</a></footer>

