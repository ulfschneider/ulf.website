---
title: googerteller
tags: journal
---
Bert Hubert wrote [googerteller](https://github.com/berthubert/googerteller), which:

> Makes a little bit of noise any time your computer sends a packet to a tracker or a Google service, which excludes Google Cloud users.
> <footer>Bert Hubert</footer>

Read about it in Berts blog post [Tracker Beeper](https://berthub.eu/articles/posts/tracker-beeper/?ref=axbom.com), describing his motivation and goals. I ran it in my Mac console and I was surprised. At some point you will shut down the program because you cannot stand the noise anymore. However, the commands for starting it up, are:

1. `brew tap robertjakub/teller`
2. `brew install --HEAD googerteller`
3. `sudo tcpdump -nql | teller`

Bert´s [GitHub page](https://github.com/berthubert/googerteller) has more details on how to run the tool. 


