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
  res.send(greeting + ' ' + who + ' from Container ' + os.hostname() + ' with IP' + ip + '\n');
});

app.get('/file', function(req, res) {
  console.log('health enquiry')  
  if (fs.existsSync('/tmp/hello/hello.conf')) {
    var file = fs.readFileSync("/tmp/hello/hello.conf").toString();}
  else {
    var file = "--No config file--";}
  res.send(file + " from Container " + os.hostname() + '\n'); 
});

app.get('/healthz', function (req, res) {
  console.log('health enquiry')
  if(healthy)
   res.send('OK');
  else
   res.status(404).send('NOT OK');
});

app.get('/kill', function (req, res) {
   healthy=false;
   res.send('Killed ' + os.hostname());
});

app.get('/', function(req, res) {
    res.send('<a href="/healthz">/healthz</a> <br> <a href="/hello">/hello</a> <br> <a href="/file">/file</a> <br> <a href="/kill">/kill</a>');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

process.on('SIGTERM', function () {
    console.log('Cleanup.....');
    process.exit();
});
