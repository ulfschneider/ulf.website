---
title: Using TextEdit as default git editor on a Mac
tags: [journal, code]
---
As a default editor for git you want something that opens up fast and is fairly simple to use. On my Mac I believe this is the system default editor – TextEdit – which comes with the system. To make it the default editor for git, issue the following command in the shell:

~~~shell
git config --global core.editor “open -e -W -n”
~~~

- `open` The command opens a file on a Mac(or a directory or URL), just as if you had double-clicked the file's icon.
- `-e` Causes the file to be opened with /Applications/TextEdit
- `-W` Causes open to wait until the applications it opens (or that were already open) have exited.
- `-n` Open a new instance of the application(s) even if one is already running.
