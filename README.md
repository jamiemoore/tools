# tools

[![Build Status](https://github.com/jamiemoore/tools/workflows/ci/badge.svg)](https://github.com/jamiemoore/tools/actions/workflows/ci.yml)
[![Docker Image Version](https://img.shields.io/docker/v/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Size](https://img.shields.io/docker/image-size/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Pulls](https://img.shields.io/docker/pulls/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Stars](https://img.shields.io/docker/stars/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![semantic-release: conventional-commits](https://img.shields.io/badge/semantic--release-conventional--commits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/github/license/jamiemoore/tools)](https://opensource.org/licenses/MIT)

Tools for diagnosis and troubleshooting with the following features:

- Interactive Shell

- Package Manager

- Preinstalled set of tools

- Small image size

- Small attack surface

- Keep in sync with upstream/parent/base releases

- Secure based on the above requirements

- Simple Dockerfile

## Usage

Interactive Shell

```
docker run -it --rm jamie/tools:1.3.16
```

Running a tool within the container

```
docker run --rm jamie/tools:1.3.16 dig www.google.com
```

## Development

Please remember to install the git hooks

```
pre-commit install
```

- Building the image

  ```
  make build
  ```

- Running the tests

  ```
  make smoke
  ```

- Running local ci pipeline (does not push the docker image)

  ```
  make ci
  ```
