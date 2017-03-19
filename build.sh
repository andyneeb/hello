# Login as user dev
oc login https://openshift.example.com:8443 -u dev -p redhat

# Switch to dev project
oc project dev

# Build from Source and Deploy
oc new-app nodejs:4~http://gogs.apps.192.168.122.100.xip.io/dev/hello.git --name=hello

# Create route
oc expose svc hello

#Set readiness probe
oc set probe dc/hello --readiness --get-url=http://:8080/api/hello --initial-delay-seconds=1 --timeout-seconds=1
