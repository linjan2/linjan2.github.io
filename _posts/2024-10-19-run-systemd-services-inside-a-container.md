---
title: Run systemd services inside a container
categories: containers
---

# Run systemd services inside a container

https://developers.redhat.com/blog/2019/04/24/how-to-run-systemd-in-a-container?extIdCarryOver=true&sc_cid=701f2000001OH7EAAW

```Dockerfile
FROM fedora

RUN yum -y install httpd; yum clean all; systemctl enable httpd;

RUN echo "Successful Web Server Test" > /var/www/html/index.html

RUN \
  mkdir /etc/systemd/system/httpd.service.d/; \
  echo -e '[Service]\nRestart=always' > /etc/systemd/system/httpd.service.d/httpd.conf

EXPOSE 80

CMD [ "/sbin/init" ]
```

```sh
podman build -t systemd:latest --file Dockerfile ./

setsebool -P container_manage_cgroup 1
podman run -d --name=systemd -p 80:80 systemd:latest
```
