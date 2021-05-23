---
title: Get the version of any npm package in JavaScript
tags: code
---
[[toc]]

## Getting the version of a different package

The version of any npm package is in its `package.json` file. From within your JavaScript code you get access to the `package.json` of all the installed packages by using the `fs` module. The following snippet will provide you the contents of the file as a JSON object.

<figure>
<figcaption>Use the <code>fs</code> module to access the contents of the <code>package.json</code>.</figcaption>
{% highlight js %}
//you don´t need to install the fs module, it´s automatically available
const fs = require('fs'); 

//replace <package-name> with real package name
const package = JSON.parse(fs.readFileSync('node_modules/<package-name>/package.json')); 

//access the version or any other property
let version = package.version; 
{% endhighlight %}
</figure>

## Getting the version of your own package

Getting the version of the package you´re currently working on is even more simple. 

<figure>
<figcaption>You don´t need the <code>fs</code> module to access the contents of the your current <code>package.json</code>. A simple <code>require</code> is enough in this case.</figcaption>
{% highlight js %}
const package = require('./package.json'); 

//access the version or any other property
let version = package.version; 
{% endhighlight %}
</figure>


