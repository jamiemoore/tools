# Variables
LOCALBIN := ./node_modules/.bin
IMAGE_NAME := $(notdir $(CURDIR))
GIT_SHA := $(shell git rev-parse --short HEAD)
GIT_DIRTY := $(shell git status --porcelain)
IMAGE_TAG := $(GIT_SHA)$(if $(GIT_DIRTY),-dirty,)
DOCKER_FILE := Dockerfile
BATS_FORMAT ?= pretty

.PHONY: all help lint ci build test run smoke history clean

# Default target
all: help

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

lint: ## lint
	@echo "yes it is me lint"
#	$(LOCALBIN)/yamllint **/*.yaml **/*.yml
#	$(LOCALBIN)/markdownlint *.md

ci: build test ## Run the CI pipeline locally but don't push an artifact

build: ## Build Dockerfile
	@docker buildx build --output type=docker -t $(IMAGE_NAME):$(IMAGE_TAG) -f $(DOCKER_FILE) .

test: smoke ## Run all tests

history: ## Get the size of the layers
	@docker history $(IMAGE_NAME):$(IMAGE_TAG)

clean: ## Clean up after build
	@docker rmi $(IMAGE_NAME):$(IMAGE_TAG)

run: ## Run Dockerfile
	@docker run -it --rm $(IMAGE_NAME):$(IMAGE_TAG)

smoke: ## Run smoke tests
	@IMAGE_NAME=$(IMAGE_NAME) IMAGE_TAG=$(IMAGE_TAG) $(LOCALBIN)/bats --formatter $(BATS_FORMAT) --timing -x -r tests/smoke
