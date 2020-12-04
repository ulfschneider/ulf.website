---
title: Split a Figure
abstract: A responsive technique of splitting a figure equally into an image (one half of the available space), and the corresponding caption (other half of the available space).
---
[[toc]]

## Rapha is the poster child

Every now and then the folks at Rapha are splitting a figure equally into an image (e.g. left half of the available space), and the corresponding caption (e.g. right half). This can be seen for example in "[Riding the Pendulum](https://www.rapha.cc/de/de/stories/riding-the-pendulum)." I think the layout is emphasizing the image and I enjoy the appearence very much. 

## Split figures example

To make the HTML of Rapha´s approach more semantic while keeping responsiveness, I´ve come up with a simplified approach that´s relying on the `<figure>` and `<figcaption>` tags in conjunction with CSS `flex-box`. 

In the below example, the first two figures use the split technique. Each image will only take half of the available space and the caption of the image will take the other half. The third figure is not using the split technique –  the image will always occupy the entire available space. 

<figure class="split">
<div><img src="/img/IMG_1329.jpg" alt=""></div>
<figcaption>A beautiful day with Emil at the Paderborn Fishponds.</figcaption>
</figure>

<figure class="split">
<figcaption>The Fishponds are a home for many waterbirds.</figcaption>
<div><img src="/img/IMG_1331.jpg" alt=""></div>
</figure>

<figure>
<img class="w-100" src="/img/IMG_1286.jpg" alt="">
<figcaption>Sunset at the the Fishponds.</figcaption>
</figure>

## The code

The split is built around the `<figure>` tag, and the CSS for the split will only become active at a screen width of at least 700px. Up to that point you have pretty normal `<figure>` and `<figcaption>` behavior (depending on your CSS).

<figure>
<figcaption>CSS</figcaption>
{% highlight css %}
img {
  max-width: 100%; /*Make images responsive.*/
}

figcaption { 
  /*This figcaption style is used*/
  /*when the figcaption is preceeding other content.*/
  margin-top: 0;
  margin-bottom: 0.81rem;
}

figure>*+figcaption { 
  /*This figcaption style is used*/
  /*when the figcaption is following other content.*/
  margin-top: 0.81rem;
  margin-bottom: 0;
}
	
.w-100 {
  /*Utility class to assign 100% width to any item.*/
  /*It is not required by the split.*/
  width: 100%;
}
	

@media screen and (min-width: 700px) {
  figure.split {
    /*We use flex-box to split the contents and align.*/
    /*Depending on the order of the figcaption (preceeding, following)*/ 
    /*it will be positioned to the left (preceeding) or to the right (following).*/
    display: flex; 
  }
	
  figure.split>* {
    flex: 1 1 50%; /*Grow and shrink equally, use 50% of width.*/
    /*Refer to https://css-tricks.com/almanac/properties/f/flex-shrink/*/
  }

  figure.split figcaption {
    margin: auto 0; /*center the figcaption vertically, thanks to flex-box*/
    padding: 0 1.62rem; /*have padding to the left and to the right*/
  }
}
{% endhighlight %}
</figure>

<figure>
<figcaption>HTML</figcaption>
{% highlight html %}
<figure class="split">
  <div> <!--The image MUST be wrapped in a div for the split to work properly-->
    <img src="/img/IMG_1329.jpg" alt="">
  </div>
  <figcaption>A beautiful day with Emil at the Paderborn Fishponds.</figcaption>
</figure>

<figure class="split">
  <figcaption>The Fishponds are a home for many waterbirds.</figcaption>
  <div> <!--The image MUST be wrapped in a div for the split to work properly-->
    <img src="/img/IMG_1331.jpg" alt="">
  </div>
</figure>

<figure>
  <!--Plain old figure. Wrapping the image into a div is not neccessary!-->
  <!--I´m only giving the image a 100% width to ensure it takes all the space-->
  <img class="w-100" src="/img/IMG_1286.jpg" alt="">
  <figcaption>Sunset at the the Fishponds.</figcaption>
</figure>
{% endhighlight %}
</figure>