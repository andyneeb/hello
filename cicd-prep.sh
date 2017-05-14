# Description: Setup Hello Demo
#

oc login -u system:admin

oc delete project myproject

# Create projects (dev/test/prod) and set access
oc adm new-project dev --admin=dev
oc adm new-project test --admin=test
oc adm new-project prod --admin=prod

oc policy add-role-to-user view test -n dev
oc policy add-role-to-user view prod -n dev
oc policy add-role-to-group system:image-puller system:serviceaccounts:test -n dev
oc policy add-role-to-group system:image-puller system:serviceaccounts:prod -n dev
oc policy add-role-to-user edit system:serviceaccount:dev:jenkins -n dev
oc policy add-role-to-user edit system:serviceaccount:dev:jenkins -n test
oc policy add-role-to-user edit system:serviceaccount:dev:jenkins -n prod


# Setup DC & Route in test & prod stage
oc project dev
# making sure imagestream nodejs is ready and tagged
oc import-image nodejs -n openshift
# better waitsome more, tags sometimes are applied with a delay
sleep 15
oc new-app nodejs~https://github.com/andyneeb/hello.git --build-env=NPM_MIRROR=https://registry.npmjs.org/


# Wait for app in dev to come up, so we can tag it
while true; do
	if oc get pods -n dev|grep -vi build|grep Running|grep "1/1" >/dev/null; then
		break
	fi
	sleep 1
done

# Sleeping additional 15 seconds
for i in {1..15}; do
	echo -n .
	sleep 1
done

oc tag dev/hello:latest dev/hello:promoteToTest
oc tag dev/hello:latest dev/hello:promoteToProd

oc project test
oc new-app dev/hello:promoteToTest
oc expose svc hello
oc set probe dc/hello --readiness --get-url=http://:8080/api/hello
oc scale dc hello --replicas=0

oc project prod
oc new-app dev/hello:promoteToProd
oc expose svc hello
oc set probe dc/hello --readiness --get-url=http://:8080/api/hello
oc scale dc hello --replicas=0

oc delete all --all -n dev

