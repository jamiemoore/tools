FROM alpine:latest
RUN apk add --no-cache curl bind-tools
ENTRYPOINT ["/bin/sh"]
