FROM alpine:3.21.2
RUN apk add --no-cache curl iputils bind-tools bash bash-completion jq
ENV PS1="\u@\h \W\\$"
CMD ["/bin/bash"]
