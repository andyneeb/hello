FROM nodejs
MAINTAINER "Andreas Neeb" "aneeb@redhat.com"
ENV UPDATED_AT 2017-03-05
USER root
RUN yum -y update && yum clean all

