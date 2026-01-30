---
title: Learning Go
abstract: I found these resources useful for learning Go
tags: code
---

[[TOC]]

## Go

- [<cite>gobyexample.com</cite>](https://gobyexample.com) excellent examples with short and clear explanations, by <a href="https://markmcgranaghan.com">Mark McGranaghan</a> and <a href="https://eli.thegreenplace.net">Eli Bendersky</a>
- [<cite>Go in one evening</cite>](https://threedots.tech/go-in-one-evening/) a practical course for experienced programmers. It´s excellent, but it took me more than one evening.
- [<cite>youtube.com/@FloWoelki</cite>](https://www.youtube.com/@FloWoelki) watch and listen while Florian is coding
- [<cite>Google Go Styleguide</cite>](https://google.github.io/styleguide/go/index) <q>The Go Style Guide and accompanying documents codify the current best approaches for writing readable and idiomatic Go</q> at Google. It has three parts: the style guide, a more verbose style decisions, and best practices.
- [<cite>100 Go mistakes and how to avoid them</cite>](https://100go.co) a summary of the original book with the same title by Teiva Harsanyi

## Test

[<cite>Testen in Go (Golang) in 90 Minuten // deutsch</cite>](https://www.youtube.com/watch?v=TG5cRcBihCM), Golo Roden, the the native web GmbH

## Error handling

[<cite>How to Handle Errors in Go</cite>](https://www.jetbrains.com/guide/go/tutorials/handle_errors_in_go/), JetBrains blog

## Vulnerability management

[<cite>govulncheck</cite>](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck) Go documentation

## Folder structure

- [<cite>Organizing a Go module</cite>](https://go.dev/doc/modules/layout) the official Go guide
- [<cite>Standard Go Project Layout</cite>](https://github.com/golang-standards/project-layout)
- [<cite>Go (Golang): Endlich Struktur im Code // deutsch</cite>](https://www.youtube.com/watch?v=2k0GYWBGGFM), Golo Roden, the native Web GmbH, the recommendation is to not create a pkg folder
- [<cite>Go Project Layout</cite>](https://medium.com/golang-learn/go-project-layout-e5213cdcfaa2) article on Medium by Kyle C. Quest
- [<cite>Embrace the Internal Package: A Go-Project Structure for Clarity.</cite>](https://bontus.medium.com/embrace-the-internal-package-a-go-project-structure-for-clarity-2207bacb4bed) article on Medium by Ikwechegh Ukandu

## Logging

- [<cite>Logging in Go with Slog: The Ultimate Guide</cite>](https://betterstack.com/community/guides/logging/logging-in-go/) a betterstack.com article by Ayooluwa Isaiah
- [<cite>Contextual Logging in Go with Slog</cite>](https://betterstack.com/community/guides/logging/golang-contextual-logging/) a betterstack.com article by Percy Bolmér
- [<cite>Slog Handler für bessere Lesbarkeit in lokalen Logs</cite>](https://pkuebler.de/posts/slog-glossy/)
- [<cite>A Guide to Writing slog Handlers</cite>](https://github.com/golang/example/tree/master/slog-handler-guide)
- [<cite>Implementing a Dynamic Package-Level Logger in Go</cite>](https://medium.com/@thisara.weerakoon2001/implementing-a-dynamic-package-level-logger-in-go-949d573a2192) a medium.com article by Thisara Weerakoon, this shows how to dynamically set log levels for certain packages and touches the [<cite>koanf</cite>](https://github.com/knadh/koanf) package to manage the logging configuration

## JSON

- Convert JSON to Go structs with [<cite>JSON to Go</cite>](https://mholt.github.io/json-to-go/)
