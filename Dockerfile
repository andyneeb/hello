FROM openshift/nodejs:8

LABEL io.k8s.display-name="My Node.js" \
      maintainer="Andreas Neeb <aneeb@redhat.com>" 

USER root
# Do some smart stuff here, for demo purposes we simply set a version
# RUN yum -y install nano && yum -y clean all
RUN echo "1.0" > /etc/imageversion
USER 1001
