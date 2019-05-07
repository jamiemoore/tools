FROM alpine:latest
RUN apk add --no-cache curl iputils bind-tools bash bash-completion
ENTRYPOINT ["/bin/bash"]
