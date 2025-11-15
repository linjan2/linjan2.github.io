---
layout: page
title: About
permalink: /about/
---

This website is a collection of notes on programming, IT operations, and software tools.

The website source is hosted at <a href="{{ site.source_repo }}">{{ site.source_repo  }}</a>.

{% assign file = site.static_files | where: "name", "about.svg" | first %}
<img src="{{ file.path }}" title="Flower image" alt="Image of a pink flower" height="100px" style="display: block; margin-left: auto; margin-right: 0;"/>
