---
layout: blank
title: active-toc
tags: tool
abstract: Highlight the entries of your table of contents while scrolling
---

<style>

  div.table-of-contents a {
      color: unset;
        text-decoration: unset;
        display: block;
    }

    div.table-of-contents .is-highlight {
        font-weight: bold;
    }

    div.table-of-contents .is-highlight::after {
        content: "*";
    }

    div.table-of-contents,
    .return  {
        margin-top: 5rem;
        position: fixed;
        width: 9rem;
        top: 0;
        left: 0;
        padding-left: 1rem;
    }

    .return {
        margin-top: 2rem;
    }

    .content {
        margin-left: 10rem;
        max-width: var(--rg-width);
    }

    @media (prefers-color-scheme: dark) {
        .table-of-contents .is-highlight {
            color: var(--primary);
        }
    }
</style>

<div class="return text-sm">
Return to <a href="/blog/tools/" class="mrb-2">tools</a>
</div>
<div class="table-of-contents text-sm">
<a href="#one-morning">One morning</a>
<a href="#he-thought">He thought</a>
<a href="#gregor-then">Gregor then</a>
<a href="#he-must">He must</a>
<a href="#doing-business">Doing business</a>
<a href="#he-felt">He felt</a>
<a href="#you-ve-got">You´ve got</a>
<a href="#if-i">If I</a>
<a href="#well">Well</a>
<a href="#he-could">He could</a>
<a href="#and-even">And even</a>
<a href="#his-boss">His boss</a>
<a href="#he-lay">He lay</a>
<a href="#a-collection">A collection</a>
<a href="#however-hard">However hard</a>
</div>

<div class="content">
<h1 >active-toc</h1>
<p>An <a href="https://www.npmjs.com/package/active-toc">npm package</a> to highlight the entries of your table of contents while scrolling your website. active-toc is leveraging the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">Intersection Observer API</a>.</p>

<hr>

<h2 id="one-morning">One morning</h2>

<p>One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a
horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly,
slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed
ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him,
waved about helplessly as he looked. "What's happened to me?"</p>

<h2 id="he-thought">He thought</h2>

<p>he thought. It wasn't a dream. His room, a proper human room although a little too small, lay peacefully
between its four familiar walls. A collection of textile samples lay spread out on the table – Samsa was a
travelling salesman – and above it there hung a picture that he had recently cut out of an illustrated
magazine
and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright,
raising a heavy fur muff that covered the whole of her lower arm towards the viewer.</p>

<h2 id="gregor-then">Gregor then</h2>

<p>Gregor then turned to look out the window at the dull weather. Drops of rain could be heard hitting the pane,
which made him feel quite sad. "How about if I sleep a little bit longer and forget all this nonsense, " he
thought, but that was something he was unable to do because he was used to sleeping on his right, and in his
present state couldn't get into that position. However hard he threw himself onto his right, he always
rolled
back to where he was.</p>

<h2 id="he-must">He must</h2>

<p>He must have tried it a hundred times, shut his eyes so that he wouldn't have to look at the floundering
legs,
and only stopped when he began to feel a mild, dull pain there that he had never felt before. "Oh, God, " he
thought, "what a strenuous career it is that I've chosen! Travelling day in and day out.</p>

<h2 id="doing-business">Doing business</h2>

<p>Doing business like this takes much more effort than doing your own business at home, and on top of that
there's
the curse of travelling, worries about making train connections, bad and irregular food, contact with
different
people all the time so that you can never get to know anyone or become friendly with them. It can all go to
Hell!"</p>

<h2 id="he-felt">He felt</h2>

<p>He felt a slight itch up on his belly; pushed himself slowly up on his back towards the headboard so that he
could lift his head better; found where the itch was, and saw that it was covered with lots of little white
spots which he didn't know what to make of; and when he tried to feel the place with one of his legs he drew
it
quickly back because as soon as he touched it he was overcome by a cold shudder. He slid back into his
former
position. "Getting up early all the time, " he thought, "it makes you stupid.</p>

<h2 id="you-ve-got">You´ve got</h2>

<p>You've got to get enough sleep. Other travelling salesmen live a life of luxury. For instance, whenever I go
back
to the guest house during the morning to copy out the contract, these gentlemen are always still sitting
there
eating their breakfasts. I ought to just try that with my boss; I'd get kicked out on the spot. But who
knows,
maybe that would be the best thing for me.</p>

<h2 id="if-i">If I</h2>

<p>If I didn't have my parents to think about I'd have given in my notice a long time ago, I'd have gone up to
the
boss and told him just what I think, tell him everything I would, let him know just what I feel. He'd fall
right
off his desk! And it's a funny sort of business to be sitting up there at your desk, talking down at your
subordinates from up there, especially when you have to go right up close because the boss is hard of
hearing.</p>

<h2 id="well">Well</h2>

<p>Well, there's still some hope; once I've got the money together to pay off my parents' debt to him – another five
or six years I suppose – that's definitely what I'll do. That's when I'll make the big change. First of allthough,
I've got to get up, my train leaves at five. " And he looked over at the alarm clock, ticking on the
chest of drawers. "God in Heaven! " he thought. It was half past six and the hands were quietly moving
forwards, it was even later than half past, more like quarter to seven. Had the alarm clock not rung?</p>

<h2 id="he-could">He could</h2>

<p>He could see from the bed that it had been set for four o'clock as it should have been; it certainly must
have
rung. Yes, but was it possible to quietly sleep through that furniture-rattling noise? True, he had not
slept
peacefully, but probably all the more deeply because of that. What should he do now? The next train went at
seven; if he were to catch that he would have to rush like mad and the collection of samples was still not
packed, and he did not at all feel particularly fresh and lively.</p>

<h2 id="and-even">And even</h2>

<p>And even if he did catch the train he would not avoid his boss's anger as the office assistant would have
been
there to see the five o'clock train go, he would have put in his report about Gregor's not being there a
long
time ago. The office assistant was the boss's man, spineless, and with no understanding. What about if he
reported sick? But that would be extremely strained and suspicious as in fifteen years of service Gregor had
never once yet been ill.</p>

<h2 id="his-boss">His boss</h2>

<p>His boss would certainly come round with the doctor from the medical insurance company, accuse his parents of
having a lazy son, and accept the doctor's recommendation not to make any claim as the doctor believed that
no-one was ever ill but that many were workshy. And what's more, would he have been entirely wrong in this
case?
Gregor did in fact, apart from excessive sleepiness after sleeping for so long, feel completely well and
even
felt much hungrier than usual. One morning, when Gregor Samsa woke from troubled dreams, he found himself
transformed in his bed into a horrible vermin.</p>

<h2 id="he-lay">He lay</h2>

<p>He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly
domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide
off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly
as he looked. "What's happened to me? " he thought. It wasn't a dream. His room, a proper human room although a
little too small, lay peacefully between its four familiar walls.</p>

<h2 id="a-collection">A collection</h2>

<p>A collection of textile samples lay spread out on the table – Samsa was a travelling salesman – and above it
there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded
frame.
It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered
the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather.
Drops of rain could be heard hitting the pane, which made him feel quite sad. "How about if I sleep a little
bit longer and forget all this nonsense, " he thought, but that was something he was unable to do because he was
used to sleeping on his right, and in his present state couldn't get into that position.</p>

<h2 id="however-hard">However hard</h2>

<p>However hard he threw himself onto his right, he always rolled back to where he was. He must have tried it a
hundred times, shut his eyes so that he wouldn't have to look at the floundering legs, and only stopped when
he began to feel a mild, dull pain there that he had never felt before. "Oh, God, " he thought, "what a strenuous
career it is that I've chosen! Travelling day in and day out. Doing business like this takes much more
effort than doing your own business at home, and on top of that there's the curse of travelling, worries about
making train connections, bad and irregular food, contact with different people all the time so that you can never
get to know anyone or become friendly with them. It can all go to Hell! " He felt a slight itch up on his belly;
pushed himself slowly up on his back towards the headboard so that he could lift his head better; found
where the itch was, and saw that it was covered with lots of little white spots which he didn't know what to make of;
and when he tried to feel the place with one of his legs he drew it quickly back because as soon as he touched
it he was overcome by a cold</p>

</div>
