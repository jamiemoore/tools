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
- Automatically keep in sync with upstream/parent/base releases
- Automatically update pinned APK package versions
- Reproducible builds
- Simple Dockerfile
- Automated Tests
- Secure based on the above requirements

## Usage

Interactive Shell

```
docker run -it --rm jamie/tools:1.4.2
```

Running a tool within the container

```
docker run --rm jamie/tools:1.4.2 dig www.google.com
```

## Development

- Ensure you have docker cli working and installed

- Install node using mise, nvm or something else, see [.nvmrc](.nvmrc) for version

- Perform a clean install with npm

  ```
  npm ci
  ```

* Linting

  ```
  make lint
  ```

* Building the image

  ```
  make build
  ```

* Running the tests

  ```
  make smoke
  ```

* Running local ci pipeline (does not perform a release and push the docker image)

  ```
  make ci
  ```

### Monitoring and Alerting

- Alerts for failed workflows are sent to a discord channel which is configured by webhook

  ```
  gh secret set DISCORD_WEBHOOK -e ci -r jamiemoore/tools
  ```

- The alert for the dead man's switch is configured using [healthchecks.io](https://healthchecks.io/) and the ping url is stored as a secret

  ```
  gh secret set PING_URL -e ci -r jamiemoore/tools
  ```

### Tech

- CI: gitHub-workflows

- Versioning: semantic-release

- Task Runner: make

- Package Management: npm

- Node: mise/nvm

### ADR

- Replaced dependabot with renovate because dependabot was limited it what it would support, nvm and lock files for example.
- Selected make because it is a generic task runner and `make ci` is better than running four different commands
  - package.json is not able to contain variables to store between commands
  - mise tasks is a future possibility, but still too new.
- Alerting, was picking the best of the worst.
  - Discord, will only send mobile notifications when the desktop is idle.
  - Slack, if I missed a notification I would likely never see it.
  - Pushover, same problem with missed notification.
- Monitoring, selected healthchecks.io as they are a dead mans switch provder with a generous free plan
- npm, selected as it is the biggest and most supported package manager in existence.
- Bats, I already knew the tool and it seemed like a good choice for smoke testing containers
  - Bats testing the container from outside rather than form inside the container, is more reflective of actual usage
- smoke testing is my only required testing for infrastructure
- Sematic release requires a Github PAT so it can bypass PR requirements and trigger another workflow, i.e. the docker hub readme updater.
- Sematic release is not currently configured to use signed commits, so the branch protection that requires signed commits is disabled.
- Only the options that commit code back, such as changelog and readme have the above requirements. It is not needed by the release or the tagging.
- The APK package versions need to be pinned because they can change depending on when the image was built.
- There is no need to run `apk update` as the index is already using the latest version with `apk add --no-cache`
- `apk upgrade` should not be run as the package versions will become unknown
