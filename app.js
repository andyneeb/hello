var express = require('express');
var os = require('os');
var ip = require('ip');
var app = express();
var greeting = process.env.GREETING;
var who = process.env.WHO;
var fs = require("fs");
var stage = fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/namespace").toString();

function say_hello(){
    return greeting + " " + who + "! Hostname: " + os.hostname() + " - IP: " + ip.address() + " - Stage: " + stage;
}

app.get('/api/hello', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send(say_hello());
});

app.get('/', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send('endpoint: <br> <a href="/api/hello">/api/hello</a>');
});

app.get('/api/health', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send("I'm ok");
});

var server = app.listen(8080, '0.0.0.0', function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Hello service running at http://%s:%s", host, port)
});
