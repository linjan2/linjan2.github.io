---
title: Create libvirt virtual machines
categories:
---

# Create libvirt virtual machines

## Resize disk space

```sh
virsh list --all
  #  Id   Name       State
  # ---------------------------
  #  -    debian12   shut off

# if not shut off
virsh shutdown debian12

# show disks on VM
virsh domblkinfo debian12 --all --human
  #  Target   Capacity     Allocation   Physical
  # ------------------------------------------------
  #  vda      20.000 GiB   5.819 GiB    20.003 GiB
  #  sda      -            -            -

# show disk path on host
virsh domblklist debian12 --details
  #  Type   Device   Target   Source
  # ----------------------------------------------------------------------------------
  #  file   disk     vda      /home/user/.local/share/libvirt/images/debian12.qcow2
  #  file   cdrom    sda      -

# ensure no snapshots exists for VM
virsh snapshot-list debian12
virsh snapshot-delete --domain debian12 --snapshotname snapshot01

# show disk information
qemu-img info /home/user/.local/share/libvirt/images/debian12.qcow2
# increase size by 10 GiB
qemu-img resize /home/user/.local/share/libvirt/images/debian12.qcow2 +10G
```

To resize disk on a running VM.

```sh
# set the new disk size
virsh blockresize debian /home/user/.local/share/libvirt/images/debian12.qcow2 30G
```

To resize a partition.

```sh
lsblk --path

# install growpart
apt install cloud-guest-utils gdisk
# or
dnf install cloud-utils-growpart gdisk

growpart /dev/vda 1
```

To resize LVM volumes.

```sh
pvresize /dev/vda1
lvs
# extend LV and file system
lvextend --resizefs --extents +100%FREE /dev/vg_name/lv_name
# or
lvextend --resizefs --size +10G /dev/vg_name/lv_name
```

To resize the file system.

```sh
df -h

# expand ext4 file system (on device or LVM volume path)
resize2fs /dev/vda1

# grow XFS file system (on file system mount path)
xfs_growfs /
```
