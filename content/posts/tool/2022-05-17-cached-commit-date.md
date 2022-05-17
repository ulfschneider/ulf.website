---
title: cached-commit-date
tags: tools
---
A [npm package](https://www.npmjs.com/package/cached-commit-date) to get the latest commit date for a given file path. As getting the commit date is a time consuming step (like 100 ms) those dates are cached so that subsequent queries for a commit date of the same file path would use the cache. Will return null and not throw an exception if the file doesn´t exist or is not under git control. I´m using it in my 11ty-powered website to show a posts date of modification.

## Install

```shell
npm i cached-commit-date
```

## Usage

```js
const ccd = require('cached-commit-date');
let date = ccd.commitDate('./content/posts/journal/2020-07-04-learn-eleventy-from-scratch.md'); //sample file path
```

## Clearing the cache

```js
ccd.clearCache();
```

## Configuration

There is no configuration.
