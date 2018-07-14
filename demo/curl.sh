clear; while true; do curl http://$(oc get route hello | grep hello | awk 'NR==1{print $2}')/hello; echo -e;sleep 1;done
