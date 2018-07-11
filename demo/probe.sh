oc set probe dc/hello --readiness --get-url=http://:8080/healthz
oc set probe dc/hello --liveness --get-url=http://:8080/healthz
