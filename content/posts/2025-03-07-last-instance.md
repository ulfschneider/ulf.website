---
title: Negative lookahead to get last instance of a word
tags: code
---
To get the last instance of ==abc== from the below string 

==abc==aaaaaaa==abc==bbbb==abc==111111==abc==22

use a regular expression negative lookahead that searches for abc not followed by any further abc. As Justin Cooney describes in his [article](https://jwcooney.com/2014/03/03/regular-expression-to-get-the-last-instance-of-a-word/), the syntax is:

```regexp
abc(?!.*abc)
```



[regular-expressions.info](https://www.regular-expressions.info/lookaround.html) provides further information about negative *and* positive lookahead.

With negative lookahead, to match a `q` not followed by a `u` use `q(?!u)`.  Positive lookahead works the same. `q(?=u)` matches a `q` that is followed by a `u`, without making the `u` part of the match.







