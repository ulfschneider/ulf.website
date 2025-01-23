---
title: Epoch Semantic Versioning
tags: 
  - code
  - bookmark
---
Anthony Fu has an interesting proposal for [<cite>Epoch Semantic Versioning</cite>](https://antfu.me/posts/epoch-semver) for high-level, end-user-facing libraries and frameworks. Anthony´s idea is based on [<cite>Semantic Versioning</cite>](https://semver.org) (SemVer), without breaking it. SemVer follows the three digit scheme `MAJOR.MINOR.PATCH`, where:

`MAJOR`
: Version when you make incompatible API changes. Major version zero (`0.MINOR.PATCH`) is for initial development. Anything MAY change at any time. The public API SHOULD NOT be considered stable.

`MINOR`
: Version when you add functionality in a backward compatible manner.

`PATCH`
: Version when you make backward compatible bug fixes.

Anthony proposes:

> Instead of treating a major version as a massive overhaul, we can break it down into smaller, more manageable updates. For example, rather than releasing v2.0.0 with 10 breaking changes from v1.x, we could distribute these changes across several smaller major releases. This way, we might release v2.0 with 2 breaking changes, followed by v3.0 with 1 breaking change, and so on. This approach makes it easier for users to adopt changes gradually and reduces the risk of overwhelming them with too many changes at once.
> <footer>Anthony Fu</footer>

> In an ideal world, I would wish SemVer to have 4 numbers: `EPOCH.MAJOR.MINOR.PATCH`. The `EPOCH` version is for those big announcements, while MAJOR is for technical incompatible API changes that might not be significant. This way, we can have a more granular way to communicate changes. […] But, of course, it’s too late for the entire ecosystem to adopt a new versioning scheme. If we can’t change SemVer, maybe we can at least extend it.  I am proposing a new versioning scheme called 🗿 Epoch Semantic Versioning, or Epoch SemVer for short. It’s built on top of the structure of `MAJOR.MINOR.PATCH`, extend the first number to be the combination of `EPOCH` and `MAJOR`. The format is as follows:
> `{EPOCH * 100 + MAJOR}.MINOR.PATCH`
> 
> `EPOCH`
> : Increment when you make significant or groundbreaking changes.
>
> `MAJOR`
> : Increment when you make minor incompatible API changes.
>
> `MINOR`
> : Increment when you add functionality in a backwards-compatible manner.
>
> `PATCH`
> : Increment when you make backwards-compatible bug fixes.
> <footer>Anthony Fu</footer>

> We shouldn’t need to bump EPOCH often. It’s mostly useful for high-level, end-user-facing libraries or frameworks. For low-level libraries, they might never need to bump EPOCH at all (ZERO-EPOCH is essentially the same as SemVer).
> <footer>Anthony Fu</footer>