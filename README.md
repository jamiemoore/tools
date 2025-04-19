# tools

[![Build Status](https://github.com/jamiemoore/tools/workflows/ci/badge.svg)](https://github.com/jamiemoore/tools/actions/workflows/ci.yml)
[![healthchecks.io](https://healthchecks.io/badge/27bf2f53-c0ef-4517-86df-6b10f21c732e/CpsP3JLr-2.svg)](https://healthchecks.io/)
[![Docker Image Version](https://img.shields.io/docker/v/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Size](https://img.shields.io/docker/image-size/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Pulls](https://img.shields.io/docker/pulls/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Stars](https://img.shields.io/docker/stars/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![License](https://img.shields.io/github/license/jamiemoore/tools)](https://opensource.org/licenses/MIT)

Tools for diagnosis and troubleshooting with the following features:

- Interactive Shell
- Package Manager
- Preinstalled set of tools
- Small image size
- Small attack surface
- Keep in sync with upstream/parent/base releases
- Reproducible builds (no latest)
- Simple Dockerfile
- Secure based on the above requirements

## Usage

Interactive Shell

```
docker run -it --rm jamie/tools:1.3.17
```

Running a tool within the container

```
docker run --rm jamie/tools:1.3.17 dig www.google.com
```

## Development

* Ensure you have docker cli working and installed

* Perform a clean install with npm

  ```
  npm ci
  ```

- Linting

  ```
  make lint
  ```

- Building the image

  ```
  make build
  ```

- Running the tests

  ```
  make smoke
  ```

- Running local ci pipeline (does not perform a release and push the docker image)

  ```
  make ci
  ```

### Sematic Release

- Sematic release requires a Github PAT so it can bypass PR requirements and trigger another workflow, i.e. the docker hub readme updater.
- Sematic release is not currently configured to use signed commits, so the branch protection that requires signed commits is disabled.
- Only the options that commit code back, such as changelog and readme have the above requirements. It is not needed by the release or the tagging.

### Monitoring and Alerting

- Alerts for failed workflows are sent to a discord channel which is configured by webhook

  ```
  gh secret set DISCORD_WEBHOOK -e ci -r jamiemoore/tools
  ```

- The alert for the dead man's switch is configured using [healthchecks.io](https://healthchecks.io/) and the ping url is stored as a secret

  ```
  gh secret set PING_URL -e ci -r jamiemoore/tools
  ```
