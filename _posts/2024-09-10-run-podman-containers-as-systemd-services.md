---
title: Run podman containers as systemd services
categories: k8s
---

# Run podman containers as systemd services

```sh

podman run --detach \
  --read-only \
  --publish 5432:5432 \
  --volume "${PWD}/secrets:/run/secrets:z,ro" \
  --volume "${PWD}/db:/var/lib/postgresql/data:U,z,rw" \
  --log-driver=k8s-file --log-opt path=log-postgresql.json  --log-opt max-size=1mb \
  --name postgresql \
  localhost/postgresql:latest

podman run \
  --cidfile=%t/%n.cid \
  --cgroups=no-conmon \
  --rm \
  --read-only \
  --replace \
  --sdnotify=conmon \
  --publish 5432:5432 \
  --volume ${VOLDIR}/volumes/postgresql/secrets:/run/secrets:z,ro \
  --volume ${VOLDIR}/volumes/postgresql/db:/var/lib/postgresql/data:U,z,rw \
  --log-driver=k8s-file \
  --log-opt path=log-postgresql.json --log-opt max-size=1mb \
  --name postgresql \
  localhost/postgresql:latest



```

```ini
[Unit]
Description=Podman container
Wants=network-online.target
After=network-online.target
RequiresMountsFor=%t/containers

[Service]
Type=simple
TimeoutStartSec=5m
Environment=PODMAN_SYSTEMD_UNIT=%n
Environment=PODMAN_SYSTEMD_UNIT=%n
LoadCredential=foobar:/etc/myfoobarcredential.txt
Environment=FOOBARPATH=%d/foobar
EnvironmentFile=/etc/environment
EnvironmentFile=/etc/environment.d/nginx.env
Restart=always
RestartSec=30
TimeoutStopSec=70
PIDFile=%t/%n-pid

ExecStartPre=/usr/bin/rm -f /%t/%n-pid /%t/%n-cid
ExecStart=/usr/bin/podman run \
  --cidfile=%t/%n.cid \
  --cgroups=no-conmon \
  --read-only \
  --rm \
  --replace \
  --sdnotify=conmon \
  --publish 5432:5432 \
  --volume ${VOLDIR}/volumes/postgresql/secrets:/run/secrets:z,ro \
  --volume ${VOLDIR}/volumes/postgresql/db:/var/lib/postgresql/data:U,z,rw \
  --log-driver=k8s-file \
  --log-opt path=log-postgresql.json \
  --log-opt max-size=1mb \
  --name ${PODMAN_SYSTEMD_UNIT} \
  --env 
  localhost/postgresql:latest
ExecStop=/usr/bin/podman stop --ignore -t 10 --cidfile=%t/%n.cid
ExecStopPost=/usr/bin/podman rm -f --ignore -t 10 --cidfile=%t/%n.cid

[Install]
WantedBy=default.target

```


| Specifier | Meaning |
|:----------|:--------|
| `%C`      | Cache directory root; `/var/cache` for system or `$XDG_CACHE_HOME` for user managers. |
| `%d`      | Credentials directory; same as `$CREDENTIALS_DIRECTORY`. |
| `%D`      | Shared data directory; `/usr/share` for system or `$XDG_DATA_HOME` for user managers. |
| `%E`      | Configuration directory root; `/etc` for system or `$XDG_CONFIG_HOME` for user managers. |
| `%h`      | User home directory; `/root` for system or `$HOME` for user managers. |
| `%H`      | Host name of system. |
| `%l`      | Short host name of system, without domain. |
| `%L`      | Log directory root; `/var/log` for system or `$XDG_STATE_HOME/log` for user managers. |
| `%n`      | Full unit name with type suffix. |
| `%N`      | Full unit name without type suffix. |
| `%t`      | Runtime directory root; `/run` for system or `$XDG_RUNTIME_DIR` for user managers. |
| `%T`      | Directory for temporary files; `/tmp` or `$TMPDIR`, `$TEMP` or `$TMP`. |
| `%V`      | Directory for larger and persistent temporary files; `/var/tmp` or `$TMPDIR`, `$TEMP` or `$TMP`. |


## podman play kube service


```sh
podman kube play --down demo.yml
```

```yaml
# ~/.containers/demo/demo.yaml

```


```ini
[Unit]
Description=Podman container-postgresql.service
Wants=network-online.target
After=network-online.target
RequiresMountsFor=%t/containers

[Service]
Type=simple
TimeoutStartSec=5m
Environment=PODMAN_SYSTEMD_UNIT=%n
EnvironmentFile=/etc/environment
EnvironmentFile=/etc/environment.d/nginx.env
Restart=always
RestartSec=30
TimeoutStopSec=70
PIDFile=%t/%n-pid

ExecStartPre=/usr/bin/rm -f /%t/%n-pid /%t/%n-cid
ExecStart=/usr/bin/podman run \
  --cidfile=%t/%n.cid \
  --cgroups=no-conmon \
  --rm \
  --sdnotify=conmon \
  --replace \
  --read-only \
  --publish 5432:5432 \
  --volume ${VOLDIR}/volumes/postgresql/secrets:/run/secrets:z,ro \
  --volume ${VOLDIR}/volumes/postgresql/db:/var/lib/postgresql/data:U,z,rw \
  --log-driver=k8s-file \
  --log-opt path=log-postgresql.json \
  --log-opt max-size=1mb \
  --name postgresql \
  --env 
  localhost/postgresql:latest
ExecStop=/usr/bin/podman stop --ignore -t 10 --cidfile=%t/%n.cid
ExecStopPost=/usr/bin/podman rm -f --ignore -t 10 --cidfile=%t/%n.cid

[Install]
WantedBy=default.target
```
