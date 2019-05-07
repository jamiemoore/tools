FROM alpine:latest
RUN apk add --no-cache curl iputils bind-tools bash bash-completion
ENV PS1="\u@\h \W\\$"
CMD ["/bin/bash"]
