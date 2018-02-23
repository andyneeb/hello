var express = require('express');
var os = require('os');
var ip = require('ip');
var app = express();
var greeting = process.env.GREETING;
var who = process.env.WHO;
var fs = require("fs");
var namespace = fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/namespace").toString();

function say_hello(){
    return greeting + " " + who + " ! My hostname: " + os.hostname() + " My IP: " + ip.address();
}

function get_namespace(){
    return "Project: " + namespace;
}

function read_file(){
    if (fs.existsSync('/tmp/hello/hello.conf')) {
    var file = fs.readFileSync("/tmp/hello/hello.conf").toString();}
    else {
    var file = "Hello";}
    return file;
}

app.get('/api/hello', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send(say_hello());
});

app.get('/api/file', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send(read_file() + " from Container " + os.hostname()); 
});

app.get('/api/project', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send(get_namespace());
});

app.get('/api/health', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send("I'm ok");
});

app.get('/', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send('<a href="/api/health">/api/health</a> <br> <a href="/api/hello">/api/hello</a> <br> <a href="api/file">/api/file</a> <br> <a href="api/project">/api/project</a>');
});

var server = app.listen(8080, '0.0.0.0', function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Hello service running at http://%s:%s", host, port)
});
