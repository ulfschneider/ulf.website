---
title: Server-side fulltext search with 11ty, MiniSearch, and Netlify edge functions
tags: code
---
[[toc]]

Fulltext search for a website can be implemented on the server or on the client. Either approach has pro´s and con´s:

## Client-side search
- Searching on the client can be done with any static website because you don´t need a server processing logic.
- You need to download the fulltext search index bevor you can start searching. That can be costly.
- If you do not want to download the index for each search request, you probably should implement a caching mechanism with a service worker. Still, the first search attempt might take time because at some point the index needs to be downloaded initially.
- Depending on how the caching is implemented, your index might not contain the data from most recent builds.
- Once you have an index cached in the browser, and you access it throught a service worker, your search becomes offline capable.

## Server-side search
- Searching on the server requires a server processing search logic. The usual static website doesn´t have that, but Netlify allows you to do it with Netlify edge functions in a Deno environment (which would be the fastest) or with Netlify serverless functions in a Node environment.
- No need to download a fulltext search index to the client.
- No need to implement caching on the client.
- Every search operates on the most recent data from the most recent build.
- The search is not offline capable.

## Edge functions

My blog had a client-side search based on [Lunr](https://lunrjs.com) for years, but the recent availability of Netlify edge functions was reason enough trying to implement a server-side solution. I ended up doing it with [MiniSearch](https://github.com/lucaong/minisearch).

Netlify edge functions come with the big advantage of being executed in a datacenter closest to the requesting user, which reduces latency. Because Netlify edge functions are executed in a Deno environment, the cold start time is faster than for serverless functions running in a Node environment, which again makes edge functions faster. A further bonus: Deno supports TypeScript out-of-the-box. Because Deno does not allow CommonJS imports, I had to replace the Lunr search library with MiniSearch.^[[<cite>Ryan Dahl and Deno</citre>](https://shoptalkshow.com/546/), Shop Talk Show 546, Dec 19, 2022]

Netlify edge functions have an execution time limit of 50 ms, a code size limit of 20 MB after compression, and the memory consumption for a set of deployed edge functions must not exceed 512 MB.^[[<cite>Edge Function Limits</cite>](https://docs.netlify.com/edge-functions/limits/), Netlify, 2022] All of those limitations shouldn´t be a problem for implementing a server-side fulltext search. 

## The search index

Before working on the search function, the fulltext search index has to be created. This will be done each time the static site is built. The resulting search index will be in  `_edge/search-index.json`.

Create an empty `_edge` folder in the root of your project and install the following dependencies into your project:

```shell
npm install --save-dev striptags@2 minisearch@6.0.0
```

Please note the striptags version 2, which is required to use CommonJS imports. Beginning with version 3 striptags does only support ES6 imports. The version 6.0.0 is set for the minisearch node package. That is important because for the edge search function a 6.0.0 version will be fetched from a CDN, and both versions, the CDN version for searching and the node package version for building the index, should match.

Because the search index is created with each build we do not need to have it under Git control. Add the following line to your `.gitignore`:

```
# .gitignore
_edge/search-index.json
```

Whatever is added to your `.gitignore` will not only be ignored by Git, but also by 11ty, which is correct for the index and you do not need to add the same entry do your `.eleventyignore` file.

In my case, with 11ty, I have a template file named `search-index.html` (the ending is `.html`, not `.json`) which I store under the input folder 11ty is using. The file looks like this:

```html
---
permalink: _edge/search-index.json
permalinkBypassOutputDir: true
eleventyExcludeFromCollections: true
layout: none
---
{% raw %}{{ collections.liveContent | searchIndex }}{% endraw %}
```

A quick explanation of what´s going on here:

`permalink: _edge/search-index.json`
: The index is named `search-index.json` and will be stored in the same directory where the edge search function will reside. This allows the search function to import the index.

`permalinkBypassOutputDir: true`
: This setting ensures the `search-index.json` does not get stored in the output directory of the build, which is often `_site`. Instead I want to have it stored in the `_edge` folder.

`eleventyExcludeFromCollections: true`
: The index should not become part of any collection.

`layout: none`
: I have a default template configured for 11ty and the search index should not be generated by using the default, which creates HTML. Because I do *not* have a template named `none` in my setup, and I´m assigning `none` as a template, no layout template is used for generating the index.

`{% raw %}{{ collections.liveContent | searchIndex }}{% endraw %}`
: The `liveContent` collection holds all content that is not a draft and that will be contained in the final website. I apply an 11ty filter named `searchIndex`, which transforms the collection into a MiniSearch index in JSON format. The `searchIndex` filter resides in a file named `_eleventy/filters.js` and does the following:

```js
//_eleventy/filters.js

const MiniSearch = require('minisearch');

module.exports = {
    //...
    searchIndex: function (collection) {
        const INDEX_FIELDS = [
            'id', //the url of the page
            'title',
            'date',
            'abstract',
            'content' //index the content
        ]; 

        const STORE_FIELDS = [
            'id', //the url of the page
            'title',
            'date',
            'abstract',
            'excerpt' //do not store the content but store the excerpt, this will reduce the size of the index
        ]; 

        let miniSearch = new MiniSearch({ fields: INDEX_FIELDS, storeFields: STORE_FIELDS });
        for (let item of collection) {
            let mappedItem = mapItem(item);
            if (mappedItem.id && !miniSearch.has(mappedItem.id))    {
                miniSearch.add(mappedItem);
            }
        }

        let searchIndex = miniSearch.toJSON();
        //store the configured index fields within the search index
        //to access it later when importing the index
        searchIndex.INDEX_FIELDS = INDEX_FIELDS;
        return JSON.stringify(searchIndex);
    }
    //...
}
```

You see there is a `mapItem` function called by the `searchIndex` function. `mapItem` is a helper which again refers to `removeHtml` and `excerptFromText`. It maps the content that is relevant for the search index from the 11ty data object to an object that can be consumed more easily during the search index processing. I´m removing all HTML from the content, because, for example, if I put a `figure` tag into a blog entry I do not want to get a hit for that entry when I search for *figure*. 

You can have all of the functions in a single file, in this case it´s  `_eleventy/filters.js`.

```js
//_eleventy/filters.js

const striptags = require('striptags');

module.exports = {
    // ...
    removeHtml: function (text) {	
        if (text) {            
            return striptags(text);
        }
    },
    excerptFromText: function (text) {
        //return the first 25 words of the text
        let excerpt = this.removeHtml(text);
        if (excerpt) {
            let words = excerpt.split(' ');
            excerpt = words.slice(0, 25).join(' ');
            if (words.length > 25) {
                excerpt += ' …'
            }
        }
        return excerpt;
    },
    mapItem: function (item) {
        return {
            id: item.url,
            title: item.data.title,
            date: item.date,
            abstract: item.data.abstract,
            content: this.removeHtml(item.templateContent),
            excerpt: this.excerptFromText(item.templateContent)
        } 
    }
    //...
}
```
	
Do not forget to add the `searchIndex` filter to your `.eleventy.js` configuration file:

```js
//.eleventy.js

const filters = require('./_eleventy/filters.js');

module.exports = function (eleventyConfig) {
    //...
    eleventyConfig.addFilter('searchIndex', filters.searchIndex);
    //...
}
```

The last thing is the `liveContent` collection. Here is how you can create it in your `.eleventy.js` file:

```js
//.eleventy.js

//...
 eleventyConfig.addCollection('liveContent', async collectionAPI => {
        //the content that is relevant for me 
        //is inside of the 11ty input folder in content/**
        //- adjust this to your needs
        return collectionAPI.getFilteredByGlob(['content/**']) 
            .filter(item => {
                //the publish date must not be in the future 
                //and frontmatter data should not have an entry of draft: true or draft: yes
                const now = new Date();
                return item.date <= now && item.data.draft !== true && item.data.draft !== 'yes'; 
             });
    });
    
//...
```

This should generate a fulltext search index of your content with each build. The index will be stored under `_edge/search-index.json`, relative to the root of your project folder.

## The search function environment

The [Netlify documentation](https://docs.netlify.com/edge-functions/get-started/) is really good at explaining step by step how to setup your local environment. In my case, it was:

1. Create the `.netlify.toml` file in the project root folder.
2. Specify inside of the `.netlify.toml` where the edge functions will reside. If nothing is specified, it will be inside of `netlify/edge-functions`, relative to the project root folder. I want to have my edge function in the `_edge` folder, which means adding the following entry in the `.netlify.toml`: \
	```
	[build]
	edge_functions = "_edge"
	```
3. Specify the URL path for the edge function, and the name of the file that holds the function code. In my case:
	```
	[[edge_functions]]
	path = "/api/search"
	function = "search"
	```
4. Install Netlify CLI globally with `npm install netlify-cli -g`.

## The search function

The edge function to respond to search requests with a URL path of  `/api/search/?query=edge` is pretty short. It will be stored in `_edge/search.js`. Because the function will be executed in Deno, only ES6 imports are allowed.

```js
//_edge/search.js

//import the search index as a json file
import searchIndex from './search-index.json' assert {type: 'json'}; 

//keep the version number of minisearch coming from the CDN 
//in sync with the node package version that is used when 
//building the search index
import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.0/dist/es/index.js'; 

//create a new miniSearch instance with the search index
//and provide the configured index fields 
//that have been attached to the search index json 
//while building the index
const miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndex), {
    fields: searchIndex.INDEX_FIELDS
}); 

//the search itself
//every Netlify edge function receives two arguments: 
//the http request that was used for calling the function
//and a Netlify specific context object (in this case we are not using it)
//see https://docs.netlify.com/edge-functions/api/
export default async (request, context) => {
    const start = Date.now();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('query');
    try {
        let results = miniSearch.search(query, { prefix: true });
        const now = Date.now();
        console.log(`The search for [${query}] returned ${results.length} results within ${now - start} milliseconds`); 
        //searches typically run within 1 millisecond
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    } catch (error) {
        console.log(`Failure when searching for [${query}]: ${error}`);
        return new Response(error.message, {
            status: 500
        });
    }
}
```

That´s it. Now you have a edge function that will fulltext-search the contents of your static website in under 1 millisecond *on the server-side.* Try if it´s working by issuing the following command from within your project folder:

```shell
netlify dev
```

Your site will be built and a server starts up that is running your edge function. It´s important to know that the static artifacts of your site are built *before* the edge functions are loaded. This ensures edge functions loading up have access to the most recent artifacts – in our case the search index. Once the startup is completed, visit the address [http://localhost:8888/api/search/?query=edge](http://localhost:8888/api/search/?query=edge) to verify your edge function returns some hits in your local dev environment. Adjust the query term to your needs.
 
## How the user will search

The last step is to connect your edge function with the user interface and to render the search results. Below is a rough sketch of how you can do it. I´m sure you will do a much more elaborate UI than this one.

```html
<form id="searchform">
    <label>Do a fulltext search
        <div>
            <input type="text" name="searchquery">
            <input type="submit" value="Search">
        </div>
    </label>
</form>

<div id="searchresults"></div>

<script>
async function submitSearch(event) {
    event.preventDefault();
	let form = event.target;
	let query = form.searchquery.value;    
	let resultBox = document.querySelector('#searchresults');
	resultBox.innerHTML = '';
    if (!query) { 
        return;
    }
    try {
		let response = await fetch(`/api/search/?query=${query}`);	
        if (response.status != 200) {
            throw (`${response.status} ${response.statusText}`);
        }
        let searchResults = await response.json();	
        if (searchResults.length) {
            let resultList = document.createElement('ul');
            for (let result of searchResults) {
                let listElement = document.createElement('li');
                listElement.innerHTML = `<a href="${result.id}">${result.title}</a>`;
                resultList.appendChild(listElement);
            }
            resultBox.innerHTML = `Results for query <strong>${query}</strong>`;          
            resultBox.appendChild(resultList);
        } else {
            resultBox.innerHTML = `No results for query <strong>${query}</strong>`;
        }		
    } catch (error) {
	  	resultBox.innerHTML = error.toString();
    }
}

let form = document.querySelector('#searchform');
form.addEventListener('submit', submitSearch);
</script>

```

## Demo

And here is how the code will work when searching *{{site.hostname}}.*

<figure class="demo-box">
<form id="searchform">
    <label>Do a fulltext search
        <div>
            <input type="text" name="searchquery">
            <input type="submit" value="Search">
        </div>
    </label>
</form>
<div id="searchresults"></div>
<script>
async function submitSearch(event) {
    event.preventDefault();
	let form = event.target;
	let query = form.searchquery.value;    
	let resultBox = document.querySelector('#searchresults');
	resultBox.innerHTML = '';
    if (!query) { 
        return;
    }
    try {
		let response = await fetch(`/api/search/?query=${query}`);	
        if (response.status != 200) {
            throw (`${response.status} ${response.statusText}`);
        }
        let searchResults = await response.json();	
        if (searchResults.length) {
            let resultList = document.createElement('ul');
            for (let result of searchResults) {
                let listElement = document.createElement('li');
                listElement.innerHTML = `<a href="${result.id}">${result.title}</a>`;
                resultList.appendChild(listElement);
            }
            resultBox.innerHTML = `Results for query <strong>${query}</strong>`;          
            resultBox.appendChild(resultList);
        } else {
            resultBox.innerHTML = `No results for query <strong>${query}</strong>`;
        }		
    } catch (error) {
	  	resultBox.innerHTML = error.toString();
    }
}
let form = document.querySelector('#searchform');
form.addEventListener('submit', submitSearch);
</script>
</figure>

When you are satisfied with your solution, a simple `git push` will make it available on the internet. There is nothing to be configured in addition at Netlify.


