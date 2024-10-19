---
title: Run podman containers as systemd services
categories: containers
---

# Run podman containers as systemd services

The systemd unit files below are for starting a pod with containers as a non-root user.

```sh
# these have to be set for running systemctl with user scope
export XDG_RUNTIME_DIR=/run/user/$(id -u)
export XDG_CONFIG_HOME=${HOME}/.config

# directory to output podman logs
mkdir ~/logs

# install user systemd service files
mv *.service "${XDG_CONFIG_HOME}/systemd/user/"
systemctl --user daemon-reload

# start the pod along with pod containers
systemctl --user start pod.service
```

## Pod service

The systemd unit file for the pod creates and removes the pod.

```ini
[Unit]
Description=Pod
Wants=network.target
After=network-online.target
RequiresMountsFor=
Requires=postgresql.service fluent-bit.service
Before=postgresql.service fluent-bit.service

[Service]
Type=forking
RemainAfterExit=yes
TimeoutStartSec=5m
PIDFile=%t/%n.pid
Restart=yes
RestartSec=30

ExecStartPre=/bin/rm --force %t/%n.pid %t/%n-pod-id
ExecStartPre=/usr/bin/podman pod create \
  --infra-conmon-pidfile %t/%n.pid \
  --pod-id-file %t/%n-pod-id \
  --name pod \
  --publish 2020:2020 \
  --publish 5432:5432 \
  --replace

ExecStart=/usr/bin/podman pod start --pod-id-file %t/%n-pod-id

ExecStop=/usr/bin/podman pod stop --ignore --pod-id-file %t/%n-pod-id --time 10

ExecStopPost=/usr/bin/podman pod rm --ignore --force --pod-id-file %t/%n-pod-id

[Install]
WantedBy=default.target
```

## Fluent-bit service

```sh
mkdir "${XDG_CONFIG_HOME}/fluent-bit"
touch "${XDG_CONFIG_HOME}/fluent-bit/fluent-bit.conf"
touch "${XDG_CONFIG_HOME}/fluent-bit/parsers.custom.conf"

podman volume create fluent-bit-data
```

```ini
[Unit]
Description=Podman fluent-bit
Wants=network.target
After=network-online.target
RequiresMountsFor=%t/containers
BindsTo=pod.service
After=pod.service

[Service]
Type=notify
NotifyAccess=all
TimeoutStartSec=5m
TimeoutStopSec=70
Environment=PODMAN_SYSTEMD_UNIT=%n
Restart=yes
RestartSec=30
PIDFile=%t/%n.pid

ExecStartPre=/usr/bin/rm --force %t/%n.pid %t/%n-cid

ExecStart=/usr/bin/podman run \
  --cidfile %t/%n.cid \
  --cgroups=no-conmon \
  --rm \
  --sdnotify=conmon \
  --replace \
  --read-only \
  --pod pod \
  --volume fluent-bit-data:/var/data:U,Z,rw \
  --volume %h/logs:/var/log/containers:z,ro \
  --volume %E/fluent-bit/fluent-bit.conf:/fluent-bit/etc/fluent-bit.conf:z,ro \
  --volume %E/fluent-bit/parsers.custom.conf:/fluent-bit/etc/parser.custom.conf:z,ro \
  --name fluent-bit \
  docker.io/fluent/fluent-bit:3.1.9

ExecStop=/usr/bin/podman stop --ignore --cidfile %t/%n.cid --time 10

ExecStopPost=/usr/bin/podman rm --ignore --force --cidfile %t/%n.cid --time 10

[Install]
WantedBy=default.target
```

## PostgreSQL service

```sh
mkdir "${XDG_CONFIG_HOME}/postgresql"
touch "${XDG_CONFIG_HOME}/postgresql/app-password"
touch "${XDG_CONFIG_HOME}/postgresql/postgresql-password"

podman volume create postgresql-data
```

```ini
[Unit]
Description=Podman postgresql
Wants=network.target
After=network-online.target
RequiresMountsFor=%t/containers
BindsTo=pod.service
After=pod.service

[Service]
Type=notify
NotifyAccess=all
TimeoutStartSec=5m
TimeoutStopSec=70
Environment=PODMAN_SYSTEMD_UNIT=%n
Restart=yes
RestartSec=30
PIDFile=%t/%n.pid

ExecStartPre=/usr/bin/rm --force %t/%n.pid %t/%n-cid

ExecStart=/usr/bin/podman run \
  --cidfile %t/%n.cid \
  --cgroups=no-conmon \
  --rm \
  --sdnotify=conmon \
  --replace \
  --read-only \
  --pod pod \
  --env POSTGRES_APP_DB=foi \
  --env POSTGRES_APP_USER=foi \
  --volume postgresql-data:/var/lib/postgresql/data:U,Z,rw \
  --volume "%E/postgresql/app-password:/run/secrets/app-password:z,ro" \
  --volume "%E/postgresql/postgres-password:/run/secrets/postgres-password:z,ro" \
  --log-driver=k8s-file \
  --log-opt path=%h/logs/postgresql.log \
  --log-opt max-size=1mb \
  --name postgresql \
  postgresql:latest

ExecStop=/usr/bin/podman stop --ignore --cidfile %t/%n.cid --time 10

ExecStopPost=/usr/bin/podman rm --ignore --force --cidfile %t/%n.cid --time 10

[Install]
WantedBy=default.target
```
