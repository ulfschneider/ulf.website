---
title: Get the version of any npm package in JavaScript
tags: code
---
[[toc]]

## Getting the version of a different package

The version of any npm package is in its `package.json` file. From within your JavaScript code you get access to the `package.json` of all the installed packages by using `require`. The following snippet will provide you the contents of the file as a JSON object.

<figure>
<figcaption>Use <code>require</code> to access the contents of the <code>package.json</code>.</figcaption>
{% highlight js %}
//replace <package-name> with real package name
const package = require('./node_modules/<package-name>/package.json'); 

//access the version or any other property
let version = package.version; 
{% endhighlight %}
</figure>

## Getting the version of your current package

<figure>
<figcaption>Your current package must be accessed without the package name.</figcaption>
{% highlight js %}
//you don´t need the package name of your current package
const package = require('./package.json'); 

//access the version or any other property
let version = package.version; 
{% endhighlight %}
</figure>


