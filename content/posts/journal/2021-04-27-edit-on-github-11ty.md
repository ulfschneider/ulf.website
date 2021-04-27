---
title: Edit on GitHub for an 11ty powered blog
---
Adding a link to edit the contentsof any page for an 11ty powered website on GitHub is simpler than I thought.^[https://www.11ty.dev/docs/quicktips/edit-on-github-links/] Example:

~~~html
{% raw %}<a href="https://github.com/ulfschneider/11ty.ulf.codes/edit/master/{{page.inputPath}}">Edit on GitHub</a>{% endraw %}
~~~

Assuming the above code is inside of an [11ty layout file](https://www.11ty.dev/docs/layouts/), here is how to get the correct url for the edit link:

1. Provide the url to the GitHub repository containing your website content. In this case `https://github.com/ulfschneider/11ty.ulf.codes/`. 
2. Add `edit/master/` to the url.
3. Add `{% raw %}{{page.inputPath}}{% endraw %}` to the url to have the relative path to the current page inside of your GitHub repository. The `inputPath` variable will be resolved to the concrete file path during build time by 11ty.