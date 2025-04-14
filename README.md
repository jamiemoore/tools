# tools

[![Build Status](https://github.com/jamiemoore/tools/workflows/ci/badge.svg)](https://github.com/jamiemoore/tools/actions/workflows/ci.yml)
[![Docker Image Version](https://img.shields.io/docker/v/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Size](https://img.shields.io/docker/image-size/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Pulls](https://img.shields.io/docker/pulls/jamie/tools)](https://hub.docker.com/r/jamie/tools)
[![Docker Image Stars](https://img.shields.io/docker/stars/jamie/tools)](https://hub.docker.com/r/jamie/tools)

Tools for diagnosis and troubleshooting in a small Docker container

## Project Requirements

- Interactive Shell
- Package Manager
- Preinstalled set of tools
- Small image size
- Small attack surface
- Keep in sync with upstream/parent/base releases
- Secure based on the above requirements

## Usage

```
docker run -it --rm jamie/tools:1.3.2
```

## Development

Please remember to install the git hooks

```
pre-commit install
```

### Task Runner

- Building the image

  ```
  make build
  ```

- Running the tests

  ```
  make smoke
  ```

- Running local ci pipeline

  ```
  make ci
  ```
