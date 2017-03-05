FROM rhscl/nodejs-4-rhel7
MAINTAINER "Andreas Neeb" "aneeb@redhat.com"
ENV UPDATED_AT 2017-03-05
RUN yum -y update && yum clean all

