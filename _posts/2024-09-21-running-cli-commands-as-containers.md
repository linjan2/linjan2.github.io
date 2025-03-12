---
title: Running CLI commands as containers
categories: uncategorized
---

# Running CLI commands as containers

```sh
podman run \
  --name image \
  --attach \
  --restart Never \
  --ipc=host \
  --network=host \
  --group-add=root \
  --uts=host \
  image:latest
```
