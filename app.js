var express = require('express');
var os = require('os');
var ip = require('ip');
var app = express();
var greeting = process.env.GREETING;
var who = process.env.WHO;

function say_hello(){
    return greeting + who + "<br> My hostname is " + os.hostname() + "<br> My IP address is " + ip.address();
}

app.get('/api/hello', function(req, resp) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.send(say_hello());
    console.log("Saying hello")
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
