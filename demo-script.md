the shell scripts are there to demo automation / cli usage. most actions should be done via gui for the demo

open terminal #1, go to hello project root
login as dev (./login.sh)
delete all resources (./delete.sh)

build hello app (./build.sh)

open terminal #2
curl endpoint (./curl.sh)

back to terminal #1
kill pod (kill.sh)
scale up (./scale.sh)
kill again (./kill.sh)
set health check (./probe.sh)
kill again (./kill.sh)




