oc delete pod $(oc get pods | grep Running | awk 'NR==1{print $1}') --now=true
