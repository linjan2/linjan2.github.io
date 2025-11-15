---
title: GitLab pipelines in monorepo
categories: 🫥uncategorized
---

# GitLab pipelines in monorepo

In a monorepo as shown below, each sub-project folder contains its own pipeline file `.gitlab-ci.yml`. The top-level `.gitlab-ci.yml` conditionally includes a sub-folder `.gitlab-ci.yml` if that sub-folder's  files changed.

```
.
├── .gitlab-ci.yml
├── subproject1/
│   ├── .gitlab-ci.yml
│   ├── Dockerfile
│   └── src/
└── subproject2/
    ├── .gitlab-ci.yml
    ├── Dockerfile
    └── src/
```

The top-level `.gitlab-ci.yml` which uses `include`. See documentation for `include` at [Use CI/CD configuration from other files](https://docs.gitlab.com/ee/ci/yaml/includes.html).

```yaml
# .gitlab-ci.yml
include:
  - local: subproject1/.gitlab-ci.yml
    rules:
      - changes:
          - subproject1/src/**/*
          - subproject1/Dockerfile

  - local: subproject2/.gitlab-ci.yml
    rules:
      - changes:
          - subproject2/src/**/*
          - subproject2/Dockerfile

# avoid empty pipeline errors when no includes are run
dummy:
  rules:
    - when: never
  script: ':'
```

The subproject pipelines below are written independently of each other. Their working directory is the repository root, so they use the files of their respective project folder.

```yaml
# subproject1/.gitlab-ci.yml
subproject1:
  stage: build
  image: quay.io/buildah/stable:latest
  variables:
    PROJECT_DIR: subproject1
    STORAGE_DRIVER: vfs
    BUILDAH_FORMAT: oci
    IMAGE_NAME: ${CI_REGISTRY_IMAGE}/${CI_JOB_NAME_SLUG}:${CI_COMMIT_REF_SLUG}
  script:
    - |
      buildah login \
        --username "${CI_REGISTRY_USER}" \
        --password "${CI_REGISTRY_PASSWORD}" \
        "${CI_REGISTRY}"

      buildah build \
        -t ${IMAGE_NAME} \
        --label=CI_COMMIT_SHA=${CI_COMMIT_SHA} \
        -f ${PROJECT_DIR}/Dockerfile \
        ${PROJECT_DIR}/src

      buildah push ${IMAGE_NAME}

      if [ "${CI_COMMIT_BRANCH}" = "${CI_DEFAULT_BRANCH}" ]
      then
        buildah push "${IMAGE_NAME}" "${CI_REGISTRY_IMAGE}:latest"
      fi
```

```yaml
# subproject2/.gitlab-ci.yml
subproject2:
  stage: build
  image: quay.io/buildah/stable:latest
  variables:
    PROJECT_DIR: subproject2
    STORAGE_DRIVER: vfs
    BUILDAH_FORMAT: oci
    IMAGE_NAME: ${CI_REGISTRY_IMAGE}/${CI_JOB_NAME_SLUG}:${CI_COMMIT_REF_SLUG}
  script:
    - |
      buildah login \
        --username "${CI_REGISTRY_USER}" \
        --password "${CI_REGISTRY_PASSWORD}" \
        "${CI_REGISTRY}"

      buildah build \
        -t ${IMAGE_NAME} \
        --label=CI_COMMIT_SHA=${CI_COMMIT_SHA} \
        -f ${PROJECT_DIR}/Dockerfile \
        ${PROJECT_DIR}/src

      buildah push ${IMAGE_NAME}

      if [ "${CI_COMMIT_BRANCH}" = "${CI_DEFAULT_BRANCH}" ]
      then
        buildah push "${IMAGE_NAME}" "${CI_REGISTRY_IMAGE}:latest"
      fi
```
