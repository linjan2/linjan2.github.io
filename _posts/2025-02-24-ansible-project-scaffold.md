---
title: Ansible project scaffold
categories: uncategorized
---

# Ansible project scaffold

## Directory layouts

```
.
├── .secrets/
│   └── vault-password.txt
├── inventory/
├── PLAYBOOK-NAME/
│   ├── ansible.cfg
│   └── playbook
└── roles/
    ├── ROLE-NAME/
    ├── ROLE-NAME/
    └── ...
```



`./PLAYBOOK-NAME/ansible.cfg`:

```ini
[defaults]
inventory=inventory
vault_password_file=../.secrets/vault-password.txt
roles_path=/usr/share/ansible/roles:/etc/ansible/roles:roles:../roles
; host_key_checking=False
; remote_user=root
ansible_managed = This file is managed by Ansible.%n
  template: {file}

; [privilege_escalation]
; become=True
; become_method=sudo
; become_user=root
; become_ask_pass=False
```

### Playbook directory layout

```
.
└── PLAYBOOK-BASIC/
    ├── ansible.cfg
    ├── inventory/
    │   ├── group_vars/
    │   │   └── all/
    │   │       └── vars.yml
    │   ├── host_vars/
    │   │   ├── localhost/
    │   │   │   └── vars.yml
    │   │   └── example.org/
    │   │       ├── vars.yml
    │   │       ├── vault
    │   │       └── vault.vars.yml
    │   └── inventory.yml
    └── project/
        └── playbook.yml
```

```
.
└── PLAYBOOK-FULL/
    ├── ansible.cfg
    ├── inventory/
    │   ├── group_vars/
    │   │   ├── all/
    │   │   │   └── vars.yml
    │   │   └── group1/
    │   │       └── vars.yml
    │   ├── host_vars/
    │   │   ├── localhost/
    │   │   │   └── vars.yml
    │   │   └── example.org/
    │   │       ├── vars.yml
    │   │       ├── vault
    │   │       └── vault.vars.yml
    │   └── inventory.yml
    ├── project/
    │   ├── playbook.yml
    │   └── roles/
    │       ├── ROLE/
    │       │   └── ...
    │       └── ROLE/
    │           └── ...
    └── readme.md
```

```
.
└── PLAYBOOK-MINIMAL/
    ├── inventory
    └── playbook.yml
```

### Roles directory layout

```
.
└── roles/
    ├── ROLE-BASIC/
    │   ├── defaults/
    │   │   └── main.yml
    │   ├── handlers/
    │   │   └── main.yml
    │   ├── tasks/
    │   │   ├── configure.yml
    │   │   └── main.yml
    │   ├── files/
    │   │   └── example.txt
    │   └── vars/
    │       └── main.yml
    │
    ├── ROLE-FULL/
    │   ├── defaults/
    │   │   └── main.yml
    │   ├── handlers/
    │   │   └── main.yml
    │   ├── meta/
    │   │   └── argument_specs.yml
    │   ├── tasks/
    │   │   ├── configure.yml
    │   │   └── main.yml
    │   ├── files/
    │   │   └── example.txt
    │   ├── templates/
    │   │   └── example.j2
    │   └── vars/
    │       └── main.yml
    │
    └── ROLE-MINIMAL/
        ├── defaults/
        │   └── main.yml
        ├── handlers/
        │   └── main.yml
        ├── meta/
        │   └── argument_specs.yml
        ├── tasks/
        │   ├── configure.yml
        │   └── main.yml
        ├── templates/
        │   └── example.j2
        └── vars/
            └── main.yml
```
