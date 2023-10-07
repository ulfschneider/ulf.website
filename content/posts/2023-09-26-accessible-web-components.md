---
title: Accessible web components?
tags: 
  - accessibility
  - code
draft: true
---
A great intro to web components.

<figure>
<iframe width="560" height="315" src="https://www.youtube.com/embed/ko1WlkT4Phc?si=Kc9yX4pmhSfbTud9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<figcaption><a href="https://www.youtube.com/live/ko1WlkT4Phc?si=Px1JmGeOEyNREUfk"><cite>Accessible web components?</cite></a>, by Manuel Matuzovic</figcaption>
</figure>

Notes:

- Web components are a set of web platform APIs (Custom Elements, Shadow DOM, ES Modules, HTML Templates, Element Internals) that allow to build fully-featured custom DOM elements.
- Custom Elements is the only mandatory API to create a web component.
- An undefined custom element is a tag with a dash inbetween and assigned CSS.
  ```html
  <star-wars>Luke Skywalker</star-wars>
  <style>
  star-wars {
    display: block;
    border: 4px solid blue;
    padding: 1em;
    }
  </style>
  ```
- A defined element in addition has a JavaScript constructor class.
  ```js
  class StarWars extends HTMLElement {
    constructor() {
     super();
    }
  }
  
  customElements.define('star-wars', StarWars);
  ```
  Defined elements hav lifecycle methods like `connectedCallback` which runs when the component is added to the page, `disconnectedCallback`, which runs when the component is removed from the page, and `attributeChangedCallback`, which runs when an attribute of the custom element changed.
- Now the defined component can be improved by adding the `character` attribute and respond to the events of the custom elements. Like using the Star Wars API to fetch details about a certain character and display those properties.
  ```html
  <star-wars character="Luke"></star-wars>
  ```

