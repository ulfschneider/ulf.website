---
title: Git rebase on main without switching branches
tags: [shell, til]
---
Updating a feature branch with changes from main without switching between branches. While you are in the feature branch:

```shell
# you are in your feature branch
# the short form to update your feature branch
git fetch origin main:main
git rebase main
```

`main:main` is a [refspec](https://mirrors.edge.kernel.org/pub/software/scm/git/docs/git-fetch.html). It has the format `<src>:<dst>` and specifies which refs to fetch from the source `<src>` and which local refs to update in the destination `<dst>`.

```shell
# you are in your feature branch
# the alternate short form to update your feature branch
git fetch origin 
git rebase origin main 
```

Notice that `git fetch origin` in the above example will not apply changes to your local main branch – it´s just fetching the origin. Still the `git rebase origin main` will apply the changes from origin´s main to your local feature branch.

The above hints are from Geoff Rich: [<cite>How to git rebase on main without switching branches</cite>](https://geoffrich.net/posts/git-rebase-with-latest-changes/).  

```shell
# the long form to update your feature branch
git checkout main
git pull
git checkout feature
git rebase main
```