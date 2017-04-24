oc new-app --name=monkey-ops --template=monkey-ops -p APP_NAME=monkey-ops -p INTERVAL=30 -p MODE=background -p TZ=Europe/Berlin --labels=app_name=monkey-ops -n dev
