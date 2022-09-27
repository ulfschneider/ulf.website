---
title: JAMStack in 10 minutes
tags: [code, article]
abstract: The JAMStack comes with the promise to make websites faster, more secure, and provide a better developer experience. Why is that the case?
draft: true
---
The JAMstack can bring huge advantages to the process of building websites, as well as to the way these websites are carried out to users. Namely, a JAMStack site

- is very fast (probably nothing can be faster than a JAMStack site),
- can run on any infrastructure and a variety of hosting services,
- scales up easily,
- is more secure,
- allows quick deployments with confidence,
- is easier to maintain,
- has an improved developer experience.

That´s a bold a claim. **JAM**Stack stands for **J**avaScript, **A**PI, and **M**arkup. Those elements are part of any website, so, how can a JAMStack site be different from a *traditional* site that is powered by a web application server? A *traditional* architecture would consist of a database, a web application server to carry out the application logic, a load balancer, and web browser clients.

<figure>
<figcaption>A <em>traditional</em> website architecture</figcaption>
</figure>

The JAMStack will eliminate the web application server and the load balancer by *prerendering* the contents of the website, which results in *static* HTML files (the **M**arkup), CSS files, and data files, like XML, JSON, and whatever the site requires. Those static files are stored on a file system which allows to move that content to a Content Delivery Network (CDN) with ease. 

<blockquote>A Content Delivery Network is a global network of servers where you can deploy your application to get it closer to users. Without a CDN, If you have a server in London, and you deploy your application on that server, your users in London will have a great experience. That's because the server is close to them so the request-to-response trip is short, hence giving them a very fast experience.

However, that is not the case for your users in other parts of the world farther from London. This is the problem that CDNs solve. Hosting providers like AWS, Azure, Netlify etc have CDNs scattered all over the world. This means that if your site is deployed on their platform, they will respond to your user's requests from the CDN closest to them. Giving everyone the same fast experience, irrespective of their location.
<footer><cite><a href="https://www.netlify.com/blog/edge-cdn-serverless-cloud-meaaning/">What is Edge, CDN, Serverless, Cloud, and all the fancy words you don´t really understand</a></cite></footer>
</blockquote>

A CDN is not a must for the JAMStack – you can use your own servers – but CDNs are *made* to deliver static files across the globe and therefore in many cases it makes sense to use them.

<figure>
<figcaption>A JAMStack architecture</figcaption>
</figure>

The repeat-interval of the prerendering, also named building, depends on the nature of the information that has to be carried out to the users. It might be multiple times per hour, daily, weekly, or monthly.

Dynamic reaction to user input will be achieved by **J**avaScript (the **J** of the JAMStack) running on the web browser, progressively enhanced by calling microservices on the server (that´s your **A**PI). For example, to perform the payment during checkout of a shopping basket, a payment service like [stripe](https://stripe.com/de) would be integrated. 

Self-developed services (as well **A**PI) have to run on a server, how is that different from a web application server? Those services would run as *Serverless Functions* on the infrastructure of your CDN provider, like AWS, Azure, or Netlify, to name a few. Of course, there is a server, but you don´t have to deal with it, you don´t have to maintain it, you will not patch it, and the developers don´t recognize it. The maintenance, the scaling and the securing is done by the provider. Because providers are focusing on those aspects they can do that most likely better than you can.

## Performance

The contents served to users are static files that can be handed over extremely fast, as there is no need anymore to evaluate logic for each user request by a web application server. It´s a low number millisecond thing. The CDN will take care of hosting the static files across the globe.

To give an example, after [Smashing Magazine](https://www.smashingmagazine.com), moved away from five different technical platforms (including WordPress) to the JAMstack with the Netlify CDN, their time to first load went down from 800ms to 80ms – a factor of 10! Smashing Magazine had 2.5 million visits each month (80,000 each day) at the time of running the project.

## Portability

Static files can be hosted almost anywhere and on any platform. 

## Scaling

Serving of static files is easy to scale, will reach the point where active scaling is required late, and anyway, the CDN will do that for you.

## Security

A JAMStack site has less moving parts and that will reduce the surface for attackers. Attacks on the web try to post something into the system and get it run inside of your infrastructure (application server, database). A CDN does not process requests similar to a web application server and therefore has limited opportunities for hackers. A JAMStack site will connect to services, but since these are often managed by specialist third parties, security gaps *should* be much better under control. But it´s clear, at the moment when services are within the system you should be concerned about security.

## Deployments with confidence

It´s hard to overemphasize the benefit of *atomic* deployments. A deployment with the JAMStack follows the pattern:

1. Develop a feature for your site locally
2. Build the static contents on the developer machine locally
3. Run the automatic tests locally
4. If no failures occurred, commit your changes into Git. You might want to ensure successful  testing with a Git pre-commit hook.You will commit the changes of your source code and not the output of your build process.
5. Push to the CDN (you might have a previous step to push to your local test environment)
6. The CDN will build the static contents
7. The CDN will run the automatic tests
8. If no failure occurred, your site goes online. If a failure occured, no deployment will take place and instead the previous version of your site will remain online.

Two important things here:

- If a failure occurred during building and testing, your new version of the site will not go online and the previous version will remain active. This is called atomic deploys. You do not have to take care of deploying different versions of services separately onto a web application server. The entire site goes online or it doesn´t. This will improve your team´s confidence in deployments.
- Because every step of changing your site is under Git control, you can step to any version of your website within a second.

## Developer Experience

The building of the static artifacts works well on a developer machine in the sense that every developer will build the complete files of the website on his/her machine, and that file output can be served with a local http server by issuing a single command. 

JavaScript can be used for the building of the static artifacts on the server and the local dev environment. [11ty](https://www.11ty.dev)) is an excellent tool for the task. This leads to having the same language for the frontend and the backend. The developers can use the same paradigms and toolings, and they can move more easily between the front and the back.

Tools like `netlify-cli` allow to run serverless functions on the local environments of the developers.

## Progressive Web Apps

I always think of *Progressive Web Apps (PWAs)* as: 

> You can have an app (cross-platform) without the need of visiting an app store.

A PWA will work without a JAMStack and vice versa. But, static artifacts, when delivered to the web browser, can nicely be injected into a PWA, where the browser will cache those artifacts under the control of a *service worker.* This will speed up the application once more, and, depending on your use case, will even make it offline-capable. The message is: The JAMStack and PWAs allow for excellent pairing. 