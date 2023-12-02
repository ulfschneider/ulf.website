---
title: Markdown GitHub-style alerts
tags: code
---
[Anthony Fu](https://antfu.me/posts/github-alerts) made a markdown-it package for GitHub-style alerts: [<cite>markdown-it-github-alerts</cite>](https://www.npmjs.com/package/markdown-it-github-alerts). I was not aware [GitHub seems to allow using the syntax already](https://github.com/orgs/community/discussions/16925). Installing Anthony´s package will let you write within your Markdown text:

```markdown
> [!TIP]
> Optional information to help a user be more successful.
```

and get:

```html
<div class="markdown-alert markdown-alert-tip">
  <p class="markdown-alert-title">
    <svg class="octicon octicon-light-bulb mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>
    Tip</p>
    <p> Optional information to help a user be more successful. </p>
</div>
```

The resulting HTML is a ==paragraph, not a blockquote==, which you can style to something like:

> [!TIP]
> Optional information to help a user be more successful.

The following alerts are available: [!NOTE] [!TIP] [!IMPORTANT] [!WARNING] [!CAUTION], and will render to:
 
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.



