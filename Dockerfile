FROM alpine:2.1.1
RUN apk add --no-cache curl iputils bind-tools bash bash-completion jq cfn-lint 
ENV PS1="\u@\h \W\\$"
CMD ["/bin/bash"]
