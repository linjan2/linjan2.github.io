---
title: Create libvirt virtual machines
categories: uncategorized
---

# Create libvirt virtual machines

```sh


```

> Ensure you have acces to device `/dev/kvm`. If it isn't accessible by default, you may need to be added to the group `kvm`.

```sh
virt-install \
  --connect qemu+ssh://vmuser@kvm0.home.lo/session \
  --name vm01 \
  --network bridge=virbr0 \
  --disk 'path=/var/lib/libvirt/images/vm01.img/,size=16,format=raw' \
  --pxe \
  --ram 2048 \
  --vcpus 1 \
  --os-type linux \
  --os-variant fedora41 \
  --sound none \
  --rng /dev/urandom \
  --virt-type kvm
```

## Define VM with YAML

JSON schema (prefix for xml attributes is `+@`).

```sh

virsh pool-dumpxml --pool user --xpath '//path/text()'


yq -x --xml-item-depth 2 --xml-force-list="animals" data.yaml

yq --output-format yaml . sample.xml

virsh dumpxml debian12  | yq --output-format json --input-format xml .  | yq --input-format json --output-format xml . > xml2.xml

virt-xml-validate domain.xml
```

[libvirt network format](https://libvirt.org/formatnetwork.html).


```json
{
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "required": ["domain"],
  "properties": {
    "domain": {
      "type": "object",
      "properties": {
        "+@type": {"type": "string", "enum": ["kvm"]},
        "name": {"type": "string"},
        "uuid": {"type": "string", "format": "uuid"},
        "primary_email": {"$ref": "#/$defs/devices"},
      }
    }
  },
  "$defs": {
    "devices": {
      "type": "object",
      "properties": {
        "emulator": {
          "const": "/usr/bin/qemu-system-x86_64"
        },
        "disk": {
          "type": "array",
          "items": {
            "type": "object"
          }
        }
      }
    }
  }
}
```

## NAT incoming traffic to VMs

VMs connected to a virtual bridge with a private IP address range isn't directly accessible from the internet. Use the following commands to set a DNAT rule that redirects incoming traffic to a private IP address.

```sh
firewall-cmd --permanent --add-rich-rule 'rule family="ipv4" source address="10.10.10.10" forward-port to-addr="10.20.20.20" to-port="443" protocol="tcp" port="443"'

firewall-cmd --permanent --add-rich-rule='rule family="ipv4" destination address="192.0.2.1" forward-port port="443" protocol="tcp" to-port="443" to-addr="192.51.100.20"'

firewall-cmd --reload
```

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
