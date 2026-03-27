---
title: Citations and Footnotes Demo
description: A sample post exercising inline citations and notes with hover previews.
pubDatetime: 2026-03-27T09:00:00+05:30
draft: false
tags:
  - demo
  - writing
citations:
  - id: 1
    text: "PLOS places numbered citations inline and keeps the bibliography straightforward and skimmable."
    href: "https://plos.org/resource/how-to-write-conclusions/"
    linkText: "PLOS author guidance"
    archiveHref: "https://web.archive.org/web/20250301000000/https://plos.org/resource/how-to-write-conclusions/"
    archiveLinkText: "Archived PLOS page"
    doi: "10.1371/journal.pbio.3002508"
    pp: "4-6"
  - id: 2
    text: "Footnotes and references are easier to scan when readers can preview them without losing reading position."
    href: "https://www.nngroup.com/articles/web-writing/"
    linkText: "NN/g on web writing"
    archiveHref: "https://web.archive.org/web/20250301000000/https://www.nngroup.com/articles/web-writing/"
    archiveLinkText: "Archived NN/g page"
    isbn: "978-0-262-16209-8"
    pp: "118-121"
footnotes:
  - id: 1
    text: "This is the sort of side note that is useful, but not important enough to interrupt the main paragraph."
  - id: 2
    text: "Notes can also carry their own outbound link when they need a little extra context."
    href: "https://astro.build/"
    linkText: "Astro"
---

This post exists purely to test how citations [1] and notes [n 1] behave inside a real article.

The main thing we want is for references to stay out of the reader's way until they are needed [2]. If the hover preview is doing its job, you should be able to check a source or a side note [n 2] without losing your place.

We can also place multiple references in one paragraph. For example, a sentence can cite a source [1] and immediately add a note [n 1] and then point to another source [2] without the rhythm feeling too clumsy.

That gives us a nice balance: numbered citations for external sources, and numbered notes for commentary that belongs near the sentence but not directly inside it.
