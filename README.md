# hello-world sample

a simple node.js showcase for openshift

/hello returns "$GREETING $WHO" with $GREETING defaulting to "Hello" and $WHO to "World" 

also shows pod hostname, pod ip to demo loadbalancing / resiliency / staging 

/healthz returns 200 OK unless set unhealthy via

/kill in which case it returns 404 NOT OK

/file ready and displays content of /tmp/hello/hello.conf

/imageversion shows version of base image layer as set via Dockerfile


# to deploy on openshift:
oc new-app nodejs:4~https://github.com/andyneeb/hello.git --name=hello

oc expose svc hello

optional - set health check:

oc set probe dc/hello --readiness --get-url=http://:8080/healthz --initial-delay-seconds=1 --timeout-seconds=1

# demo config change
oc env dc hello WHO=Munich

# scale
oc scale dc hello --replicas=3

