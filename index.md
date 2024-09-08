---
layout: home
---

{% assign file = site.static_files | where: "name", "index.svg" | first %}
<img src="{{ file.path }}" title="Elephant image" alt="Image of an elephant on a path" width="100%"/>
