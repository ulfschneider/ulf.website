---
title: markdown-it-cooklang
tags: 
  - tool
  - code
---
A [markdown-it plugin](https://www.npmjs.com/package/markdown-it-cooklang) that provides an incomplete implementation of [cooklang.org](https://cooklang.org).

I used the logic for a different thing than a cooking recipe. Instead, I described on my 11ty powered website the process of building a bicycle with all required ingredients (parts), and cookware (tools). See [Fairlight Strael Build Notes](/2022-02-27-fairlight-strael-build-notes/). At the end of the document you see a list of parts to order and tools to use. Those lists are created by using markdown-it-cooklang.


## Install

```shell
npm i markdown-it-cooklang
```

## Usage

```js
var markdownIt = require('markdown-it');
var markdownItCooklang = require('markdown-it-cooklang');

markdownIt({
    html: true
    })
    .use(markdownItCooklang);
```

## Configuration

There is no configuration.
