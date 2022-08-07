---
title: .gitignore an already committed folder
tags: [code, shell]
---
I accidentially committed a folder that is generated during each build automatically. It´s not necessary to have that folder under git control. To not have that folder tracked in the future anymore the following process can be applied:

1. Commit the uncommitted changes in the repo 
2. Edit `.gitignore` to ignore the folder
3. `git rm -r --cached .`  
5. `git add .`  
5. `git commit -m "Have working .gitignore"` 

The solution was described by Théo Attali on [stackoverflow](https://stackoverflow.com/a/43142955) in 2017.The [git-rm documentation](https://git-scm.com/docs/git-rm) explains the used options:

`-r`
: Allow recursive removal when a leading directory name is given.

`-- cached`
: Use this option to unstage and remove paths only from the index. Working tree files, whether modified or not, will be left alone.

`.`
: All files
