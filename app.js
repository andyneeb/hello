var express = require('express');
var os = require('os');
var ip = require('ip');
var greeting = process.env.GREETING;
var who = process.env.WHO;
var fs = require("fs");
var healthy=true;
const PORT = 8080;
const app = express();

function read_file(){
    if (fs.existsSync('/tmp/hello/hello.conf')) {
    var file = fs.readFileSync("/tmp/hello/hello.conf").toString();}
    else {
    var file = "Hello";}
    return file;
}

app.get('/hello', function (req, res) {
  res.send(greeting + ' ' + who + ' from Container ' + os.hostname() + ' with IP' + ip.address() + '\n');
});

app.get('/file', function(req, res) {
    res.send(read_file() + " from Container " + os.hostname() + '\n'); 
});

app.get('/healthz', function (req, res) {
  console.log('health enquiry')
  if(healthy)
   res.send('OK');
  else
   res.status(404).send('NOT OK');
});

app.get('/cancer', function (req, res) {
   healthy=false;
   res.send('Killed ' + os.hostname());
});

app.get('/', function(req, res) {
    res.send('<a href="/healthz">/healthz</a> <br> <a href="/hello">/hello</a> <br> <a href="/file">/file</a>');
});



app.listen(PORT, '0.0.0.0'); 
    console.log('Hello service running at http://localhost:' + PORT);


process.on('SIGTERM', function () {
    console.log('Cleanup.....');
    process.exit();
});
