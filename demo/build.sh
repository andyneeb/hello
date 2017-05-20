# Login as user dev
oc login -u dev -p redhat

# Switch to dev project
oc project dev

# Build from Source and Deploy
oc new-app nodejs:4~http://gogs.192.168.42.164.nip.io/dev/hello.git --name=hello

# Create route
oc expose svc hello
