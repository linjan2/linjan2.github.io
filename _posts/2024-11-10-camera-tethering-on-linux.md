---
title: Camera tethering on Linux
categories: linux
---

# Camera tethering on Linux

Install `gphoto2`.

```sh
sudo dnf install gphoto2
man gphoto2

# show settings
cat ~/.gphoto/settings

# various options
gphoto2 --list-config
gphoto2 --get-config shutterspeed
gphoto2 --get-config capturetarget
# only use camera RAM for storing images (not SD card)
gphoto2 --set-config capturetarget=0

# list the auto-detected cameras
gphoto2 --auto-detect
gphoto2 --summary
gphoto2 --list-files
gphoto2 --get-all-files
```

Create the script `gphoto-hook.sh` as below. It's the hook that is run when a photo is taken.

```sh
#!/bin/sh
case "${ACTION}" in
  start)
  ;;
  download)
    echo "Downloaded image ${PWD}/${ACTION}"
  ;;
esac
```

Start tethering.

```sh
# tether and capture camera shots
gphoto2 --capture-tethered --hook-script=./gphoto-hook.sh
  # if multiple devices are detected use e.g. --camera='Sony Alpha-A6000'
```

```sh
# capture and save on SD card
gphoto2 --capture-image

# capture and save on SD card, download to computer, then delete from camera
gphoto2 --capture-image-and-download --filename %Y%m%d%H%M%S.arw
```
