FROM postgres:13

RUN yum update -y && \
    yum install -y jq bash && \
    yum clean all

WORKDIR /app

EXPOSE 3000

ENTRYPOINT ["/run.sh"]