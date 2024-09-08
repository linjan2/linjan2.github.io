---
layout: page
title: About
permalink: /about/
---

This website is a collection of notes on computers, programming, IT operations technology, and such.

The website source is hosted at <a href="{{ site.source_repo }}">{{ site.source_repo  }}</a>.

{% assign file = site.static_files | where: "name", "about.svg" | first %}
<img src="{{ file.path }}" title="Elephant image" alt="Image of an elephant on a path" height="100px" style="display: block; margin-left: auto; margin-right: 0;"/>
