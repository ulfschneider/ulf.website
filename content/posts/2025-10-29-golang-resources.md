---
title: Golang resources
abstract: I found these useful for learning Golang
tags: code
draft: true
---
[[TOC]]

## Go
- [<cite>gobyexample.com</cite>](https://gobyexample.com) excellent examples with short and clear explanations
- [<cite>Go in one evening</cite>](https://threedots.tech/go-in-one-evening/) a practical course for experienced programmers
- [<cite>youtube.com/@FloWoelki</cite>](https://www.youtube.com/@FloWoelki) watch and listen while Florian is coding
- [<cite>Google Go Styleguide</cite>](https://google.github.io/styleguide/go/index) <q>The Go Style Guide and accompanying documents codify the current best approaches for writing readable and idiomatic Go</q> at Google. It has three parts: the style guide, a more verbose style decisions, and best practices.
- https://100go.co

## Test
- https://www.youtube.com/watch?v=TG5cRcBihCM

## Error handling

https://www.jetbrains.com/guide/go/tutorials/handle_errors_in_go/

## Vulnerability management

https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck

## Folder structure

- https://github.com/golang-standards/project-layout
- https://medium.com/golang-learn/go-project-layout-e5213cdcfaa2 
-[<cite> Embrace the Internal Package: A Go-Project Structure for Clarity.</cite>](https://bontus.medium.com/embrace-the-internal-package-a-go-project-structure-for-clarity-2207bacb4bed)
- https://www.youtube.com/watch?v=2k0GYWBGGFM here the recommendation is to not create a pkg folder.

## JSON

- [<cite>JSON to Go</cite>](https://mholt.github.io/json-to-go/)

## Logging

- [<cite>Logging in Go with Slog: The Ultimate Guide</cite>](https://betterstack.com/community/guides/logging/logging-in-go/) a betterstack.com article by Ayooluwa Isaiah
- [<cite>Contextual Logging in Go with Slog</cite>](https://betterstack.com/community/guides/logging/golang-contextual-logging/) a betterstack.com article by Percy Bolmér
- [<cite>Slog Handler für bessere Lesbarkeit in lokalen Logs</cite>](https://pkuebler.de/posts/slog-glossy/)
- [<cite> A Guide to Writing slog Handlers</cite>](https://github.com/golang/example/tree/master/slog-handler-guide)
- [<cite>Implementing a Dynamic Package-Level Logger in Go</cite>](https://medium.com/@thisara.weerakoon2001/implementing-a-dynamic-package-level-logger-in-go-949d573a2192) a medium.com article by Thisara Weerakoon, this shows how to dynamically set log levels for certain packages and touches the [<cite>koanf</cite>](https://github.com/knadh/koanf) package to manage the logging configuration

## Watch and hot reload 

https://github.com/air-verse/air