oc rsync . $(oc get pods | grep Running | awk 'NR==1{print $1}'):/opt/app-root/src -w --exclude=* --include=app.js
