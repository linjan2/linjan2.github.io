---
title: KinD Cluster
categories: k8s
---

# KinD Cluster

https://github.com/settings/tokens

```sh
kind create cluster --name dev --config kind-cluster.yaml --kubeconfig kind.yaml

export KUBECONFIG="${PWD}/kind.yaml"
kubectl cluster-info --context kind-dev
kubectl get nodes

kind load docker-image
```

```yaml
# kind-cluster.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP
  - role: control-plane
  - role: control-plane
  - role: worker
  - role: worker
  - role: worker
```

## Install FluxCD

Download `flux` CLI tool from https://github.com/fluxcd/flux2/releases.

For encrypting secrets, download `age` from https://github.com/FiloSottile/age/releases and `sops` from https://github.com/getsops/sops/releases.

```sh
# verify kubernetes cluster environment
flux check --pre

flux bootstrap git \
  --url=git@github.com:linjan2/k8s-clusters.git \
  --branch=main \
  --path=clusters/dev \
  --ssh-hostkey-algos=rsa-sha2-512,rsa-sha2-256 \
  --private-key-file=./id_rsa.fluxcd \
  --password=${PRIVATE_KEY_PASSPHRASE} \
  --registry=docker.io/fluxcd

# generate age keys
age-keygen -o keys.txt
kubectl create --namespace=flux-system \
  secret generic sops-age \
  --from-file=age.agekey=keys.txt
```

```sh
git clone git remote add origin git@github.com:linjan2/k8s-clusters.git
cd k8s-clusters/
vim ./clusters/dev/kustomization-infrastructure.yaml
```

```yaml
# clusters/dev/kustomization-infrastructure.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: infrastructure
  namespace: flux-system
spec:
  # suspend: true
  interval: 10m0s
  sourceRef:
    kind: GitRepository
    name: flux-system
  path: ./infrastructure/dev
  prune: true
  wait: true
  decryption:
    provider: sops
    secretRef:
      name: sops-age
```


## Install ingress-nginx


```yaml
# infrastructure/dev/helmrepository-ingress-nginx.yaml
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: ingress-nginx
  namespace: flux-system
spec:
  interval: 1m
  url: https://kubernetes.github.io/ingress-nginx
```

```yaml
# infrastructure/dev/helmrelease-ingress-nginx.yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: ingress-nginx
  namespace: ingress
spec:
  interval: 5m
  chart:
    spec:
      chart: ingress-nginx
      version: '>4.10.1'
      sourceRef:
        kind: HelmRepository
        name: ingress-nginx
        namespace: flux-system
      interval: 5m
  values:
    controller:
      ingressClassResource:
        default-ssl-certificate: ingress/default-ssl-certificate
      replicaCount: 1
      minAvailable: 1
      allowSnippetAnnotations: true
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: devops-toolkit
  annotations:
    ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: ImplementationSpecific
        backend:
          service:
           name: devops-toolkit
           port:
             number: 80
    # host: dev.devops-toolkit.192.168.64.199.xip.io
```

## Destroy the cluster

```sh
kind delete cluster --name dev
```