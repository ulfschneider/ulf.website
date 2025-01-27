---
title: Make TextMate the default shell editor
tags: shell
---

[[toc]]

## Editing from the shell

My Mac is set up to use [<cite>Oh My Zsh</cite>](https://ohmyz.sh) as a shell prompt and I prefer to avoid using nano or pico when editing files from the shell. My global `.gitconfig` and my `.zshrc` files are modified in a way to start up the built-in Mac editor TextEdit for such cases. This should go in a way to start the editor from the shell, complete the editing in the editor *while the shell command is waiting for you to close the editor,* returning to the shell and going on with I you wanted to do. 

## The -W option of TextEdit is not working for me

The command for opening TextEdit from the shell, and waiting for returning, is documented as:

```sh
open -e -W -n <file-to-edit>
```

With the options:

`-e`
: Open the `<file-to-edit>` with TextEdit

`-n`
: Open a new instance of TextEdit, even if TextEdit is already open.

`-W`
: Wait until the instance of TextEdit is closed again.

Recently I noticed the waiting is not working anymore. When closing the editor, the shell is waiting forever and I cannot proceed with what I wanted to do. I have to stop then the waiting process by pressing <kbd>CTRL</kbd> <kbd>C</kbd>. I cannot tell if it´s a problem of TextEdit or of Oh My Zsh. 

## TextMate is fine

Because of the difficulties with TextEdit, I installed [<cite>TextMate</cite>](https://macromates.com). The waiting works properly for TextMate, and it is a lean and easy to use editor on the Mac. To make TextMate your default shell editor, you have to:

1. Go to **TextMate → Settings → Terminal** and install the TextMate shell support. 
2. Copy the line 
   ```sh
   export EDITOR="/usr/local/bin/mate -w"
   ```
   and replace in your `~/.zshrc` file (or your `~/.bashrc`, depending what shell you are using) the line that is starting with `export EDITOR ...` with the copied content.
3. In addition I have created an alias in my `~/.zshrc` file by adding the line 
   ```sh
   alias edit="/usr/local/bin/mate -w"
   ```
   which allows me to edit any file from the shell by typing 
   ```sh
   edit <file-to-edit>
   ```

## No `~/.gitconfig` editor setting required

With the above TextMate setup there is no need to have any editor config inside of the global `~/.gitconfig` file. If you have there an entry like `editor = ...`,  you can remove that line. Still, whenever Git requires to edit something, TextMate will get used.

