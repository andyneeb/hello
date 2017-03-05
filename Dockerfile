FROM nodejs
ENV UPDATED_AT 2017-03-05
USER root
RUN yum -y update && yum -y clean all
USER 1001

