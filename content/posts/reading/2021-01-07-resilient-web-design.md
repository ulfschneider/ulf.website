---
title: Resilient Web Design ★
---
<figure class="rg:split">
<img src="/img/jeremy-keith-resilient-web-design.png" alt="">
<figcaption>Cover of Jeremy Keith´s book "Resilient Web Design"</figcaption>
</figure>

[Resilient Web Design](https://resilientwebdesign.com) by [Jeremy Keith](https://resilientwebdesign.com/author/) is a pleasure to read. Jeremy has put together context and concept for a deep understanding of the web. The writing, as well as the presentation, is with style. It´s inviting the reader. Each chapter has valuable links which by themselves are a pleasure to follow. The book is available online, free, and because Jeremy made it a *Progressive Web App*, you can even read it offline! 

*Resilient Web Design* requires to acknowledge and embrace the unpredictability of the web.

What I´m taking from the book:

[[toc]]

## Foundations

Let´s share what we know.

Tim Berners-Lee´s *"Information Management: A Proposal"* was what would become the World Wide Web. Berners-Lee´s supervisor, Mike Sendall, gave the go-ahead with his comment 

<blockquote>
Vague but exciting…
<footer>Mike Sendall</footer>
</blockquote>

The killer feature of the web is the `a` element, which stands for *anchor.* Links make the web a hypertext system. These links are laughably simplistic. There is no two-way linking. This simplicity of the web is the secret of its success.

As soon as there were two web browsers in the world, interoperability and backwards compatibility became important issues.  

## Materials

The ongoing development and advancement of the web is possible because web browsers ignore HTML tags they don´t know, simply display the text within the tag, and keep working without throwing an error. 

<figure>
<figcaption><code>p</code> is a known HTML tag</figcaption>
{% highlight html %}
<p>some text</p>
{% endhighlight %}
</figure>

<figure>
<figcaption><code>marklar</code> is not a HTML tag. The browser will display only the text within the tag.</figcaption>
{% highlight html %}
<marklar>some more text</marklar>
{% endhighlight %}
</figure>

This liberal attitude allowed HTML to grow, because it allows web browsers to implement features at different rates.

Styling HTML with CSS is the same. The simple pattern

<figure>
<figcaption>CSS: select an element and give its properties style</figcaption>
{% highlight css %}
selector {
  property: value;
  }
{% endhighlight %}
</figure>

will select an element and give its properties style. When using a selector or a property a web browser doesn´t understand, again, it will simply be ignored and the web browser will process further without throwing an error.

## Visions

Web-capable mobile devices – the iPhone – swiped away the assumption of 960px wide layouts. Mobile devices revealed the true nature of the web as a flexible medium filled with unknowns. That´s when *Responsive Web Design,* as named by Ethan Marcotte, arrived. *Responsive Web Design* is

1. Fluid grids
2. Flexible images
3. Media queries

Around that time the term *Mobile First* was coined by Luke Wrobelski. It requires prioritizing content and make it work within the confined space of a small screen. That´s *resilient design* which can be built upon.

<blockquote>
The lack of a media query is your first media query.
<footer>Stephany and Bryan Rieger</footer>
</blockquote>

<blockquote>
The primary design principle underlying the Web’s usefulness and growth is universality. The Web should be usable by people with disabilities. It must work with any form of information, be it a document or a point of data, and information of any quality – from a silly tweet to a scholarly paper. And it should be accessible from any kind of hardware that can connect to the Internet: stationary or mobile, small screen or large.
<footer>Tim Berners-Lee</footer>
</blockquote>

## Languages

HTML and CSS are declarative languages. With HTML, you can describe the nature of the content. With CSS, you can describe the desired appearance of the content. Both language are failure-tolerant.

Most programming languages are not declarative, they are imperative. Imperative languages require precise instructions to the computer. Imperative languages provide more power and precision but are not failure-tolerant.

JavaScript is an imperative language. It tends to be more fragile than HTML. Therefore relying on JavaScript for providing a core user experience might not be good idea.

<blockquote>
The web is not a platform … It´s cross-platform … Platforms are controlled and predictable. The World Wide Web is chaotic and unpredictable.
<footer>Jeremy Keith</footer>
</blockquote>

## Layers

Not everyone will experience the same visual design of a website. This is not a bug. This is a feature of the web. New browsers and old browsers; monochrome displays and multi‐coloured displays; fast connections and slow connections; big screens, small screens, and no screens; everyone can access your content. That content should look different in such varied situations. If a website looks the same on a ten‐year old browser as it does in the newest devices, then it probably isn’t taking advantage of the great flexibility that the web offers.

<blockquote><a href="http://dowebsitesneedtolookexactlythesameineverybrowser.com">Do websits need to look exactly the same in every browser?</a> No!
<footer>Dan Cederholm</footer>
</blockquote>

Use feature detection, not browser detection, to *progressively enhance the user experience.* If a feature is not available, don´t do anything else. The core functionality should work for everyone, the enhancements drive the user experience further for users with more modern systems. 

<blockquote>
Support every browser …but optimise for none.
<footer>Jeremy Keith</footer>
</blockquote>


## Steps

To get to the heart of a website’s purpose, we should consider the interface in its larger context: what are people trying to accomplish?

The three-step approach to resilient web design:

1. Identify the core functionality.
2. Make that functionality available using the simplest possible technology.
3. Enhance!

Start to implement this layered approach without having to convince your colleagues, your boss, or your clients. If they don’t care, then they also won’t notice. 

## Challenges

<blockquote>
When I’m confronted with a problem, and I have the choice of making it the user’s problem or my problem, I’ll make it my problem every time. That’s my job.
<footer>Jeremy Keith</footer>
</blockquote>

1. Acknowledge and embrace unpredictability *(which is the driving force of resilient web design).*
2. Think and behave in a future-friendly way *(the best way of doing this is to be backwards compatible).*
3. Help others do the same.



