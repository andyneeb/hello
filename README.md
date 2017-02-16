# hello-world microservice

a simple node.js showcase for openshift

endpoint /api/hello returns "Hello $GREETING" with $GREETING defaulting to "World"

also shows pod hostname & ip to demo loadbalancing / resiliency / ...

# to deploy on openshift:
oc new-app nodejs:4~https://github.com/andyneeb/hello-ms.git --name=hello

oc expose svc hello --path=/api/hello

optional - set health check:

oc set probe dc/hello --readiness --get-url=http://:8080/api/hello --initial-delay-seconds=2 --timeout-seconds=5

# demo config change
oc env dc hello GREETING=Munich

# scale
oc scale dc hello --replicas=3



