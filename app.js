var express = require('express');
var mysql = require('mysql');
var os = require('os');
var ip = require('ip');
var cors = require('cors');
var fs = require("fs");

var pool      =    mysql.createPool({
    connectionLimit : 100,
    host     : 'database',
    user     : 'hello',
    password : 'redhat',
    database : 'hello',
    debug    :  false
});

var greeting = process.env.GREETING;
var who = process.env.WHO;
var healthy=true;

var PORT = 8080;
var app = express();

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

app.get('/kill', function (req, res) {
   healthy=false;
   res.send('Killed ' + os.hostname());
});

app.get('/', function(req, res) {
    res.send('<a href="/healthz">/healthz</a> <br> <a href="/hello">/hello</a> <br> <a href="/file">/file</a> <br> <a href="/kill">/kill</a>');
});

function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("select * from user",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

app.get("/dbtest",function(req,res){-
        handle_database(req,res);
});

app.listen(PORT, '0.0.0.0'); 
    console.log('Hello service running at http://localhost:' + PORT);


process.on('SIGTERM', function () {
    console.log('Cleanup.....');
    process.exit();
});
