---
title: mermaid-cli-batch
abstract: A command line tool to process multiple [Mermaid](https://mermaid.js.org) diagrams in one pass into SVG diagrams.
tags: 
  - tool
  - code
---
[<cite>mermaid-cli-batch</cite>](https://www.npmjs.com/package/mermaid-cli-batch) is a npm/node based command-line tool to process Mermaid diagram definition files in batches. For instance, to convert all `.mmd` files to SVG images, run the command:

```sh
npx mermaid-cli-batch --input *.mmd
```

List possible settings by issuing the command:

```sh
npx mermaid-cli-batch -h
```