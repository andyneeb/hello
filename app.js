var express = require('express');
var os = require('os');
var networkInterfaces = os.networkInterfaces();
var ip = networkInterfaces['eth0'][0]['address']
var fs = require("fs");
var port = 8080;
var greeting = process.env.GREETING || 'Hello';
var who = process.env.WHO || 'World';
var healthy=true;
var app = express();

app.get('/hello', function (req, res) {
  console.log('saying hello')
  res.send(greeting + ' ' + who + ' from container ' + os.hostname() + ' with Ip address ' + ip);
});

app.get('/file', function(req, res) {
  console.log('reading config file')  
  if (fs.existsSync('/tmp/hello/hello.conf')) {
    var file = fs.readFileSync("/tmp/hello/hello.conf").toString();}
  else {
    var file = "--No config file--";}
  res.send(file + " from Container " + os.hostname() + '\n'); 
});

app.get('/imageversion', function(req, res) {
  console.log('getting base image version')  
  if (fs.existsSync('/etc/imageversion')) {
    var imageversion = fs.readFileSync("/etc/imageversion").toString();}
  else {
    var imageversion = 'not set';}
  res.send('Image version : ' + imageversion + '\n'); 
});

app.get('/healthz', function (req, res) {
  if(healthy)
   res.send('OK');
  else
   res.status(404).send('NOT OK');
});

app.get('/kill', function (req, res) {
  console.log('setting unhealthy')
  healthy=false;
  res.send('Killed ' + os.hostname());
});

app.get('/', function(req, res) {
    res.send('<a href="/imageversion">/imageversion</a> <br> <a href="/healthz">/healthz</a> <br> <a href="/hello">/hello</a> <br> <a href="/file">/file</a> <br> <a href="/kill">/kill</a>');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

process.on('SIGTERM', function () {
    console.log('Cleanup.....');
    process.exit();
});
