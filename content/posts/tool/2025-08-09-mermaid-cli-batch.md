---
title: mermaid-cli-batch
abstract: A command line tool to process multiple diagrams in one pass into SVG  images.
tags: 
  - tool
  - code
---
[<cite>mermaid-cli-batch</cite>](https://www.npmjs.com/package/mermaid-cli-batch) is a npm/node based command-line tool to process [Mermaid](https://mermaid.js.org) diagram definition files in batches. For instance, to convert all `.mmd` files to SVG images, run the command:

```sh
npx mermaid-cli-batch --input *.mmd
```

List possible tool settings by issuing the command:

```sh
npx mermaid-cli-batch -h
```

mermaid-cli-batch has a peer dependency to Playwright that you have to install by yourself prior of using the package:

```sh
npm i playwright
npx playwright install chromium
```

This allows you to update playwright independently of mermaid-cli-batch!