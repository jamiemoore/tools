FROM alpine:3.22.0
RUN apk add --no-cache \
    curl=8.12.1-r1 \
    iputils=20240905-r0 \
    bind-tools=9.18.36-r0 \
    bash=5.2.37-r0 \
    bash-completion=2.14.0-r0 \
    jq=1.7.1-r0
ENV PS1="\u@\h \W\\$"
CMD ["/bin/bash"]
