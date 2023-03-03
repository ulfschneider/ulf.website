---
title: Shell history
tags: [shell, til]
---
The history command in the Linux shell is a powerful tool to work with the past issued commands. 

```shell
# show the history of all past commands
$ history
 1  git status
 2  git branch --list
 3  git checkout centered-layout
 4  git rebase master
 5  netlify dev
```

To get the any command of the hisotry list into the prompt, key in the exclamation mark followed by the number of the command in the history:

```shell
# bring the first issued command into the command prompt 
$ !1
$ git status
```

The history can also get searched:

```shell
# list all issued commands that contain git
$ history | grep git
```

And the history can be cleared:

```shell
# clear the history
$ history -c
```