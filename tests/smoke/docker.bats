#!/usr/bin/env bats

[ -z "$IMAGE_NAME" ] && echo "ERROR: IMAGE_NAME environment variable must be set" && exit 1
[ -z "$IMAGE_TAG" ] && echo "ERROR: IMAGE_TAG environment variable must be set" && exit 1

IMAGE_ID="${IMAGE_NAME}:${IMAGE_TAG}"
REQUIRED_TOOLS=(bash curl dig grep jq ping)

check_tool_installed () {
    local tool=$1
    run docker run --rm "$IMAGE_ID" which "$tool"
    [ "$status" -eq 0 ]
    [[ "$output" =~ "$tool" ]]
}

for tool in "${REQUIRED_TOOLS[@]}"; do
    bats_test_function --description "check $tool is installed" --tags "docker" -- check_tool_installed $tool
done