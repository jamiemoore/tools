FROM alpine:3.21.0
RUN apk add --no-cache curl iputils bind-tools bash bash-completion jq ansible
ENV PS1="\u@\h \W\\$"
CMD ["/bin/bash"]
