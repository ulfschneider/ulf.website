---
title: How to git rebase on main without switching branches
tags: shell
draft: true
---
Geoff Rich has this hint for updating a feature branch with changes from main without switching between branches: [<cite>How to git rebase on main without switching branches</cite>](https://geoffrich.net/posts/git-rebase-with-latest-changes/). In short:

```shell
git fetch origin main:main
git rebase main
```

`main:main` is a [refspec|(https://mirrors.edge.kernel.org/pub/software/scm/git/docs/git-fetch.html). It specifies which refs to fetch and which local refs to update. <q>The format of a `<refspec>` parameter is an optional plus `+`, followed by the source `<src>`, followed by a colon `:`, followed by the destination ref `<dst>`.</q>

Alternativeley:

```shell
git fetch origin
git rebase origin main
```