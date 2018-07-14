var express = require('express');
var os = require('os');
var fs = require("fs");

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
var mongoURLLabel = "";

var greeting = process.env.GREETING;
var who = process.env.WHO;
var healthy=true;

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

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    
  }
}

var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/dbtest', function (req, res) {
   // try to initialize the db on every request if it's not already
   // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.send({ pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.send({ pageCountMessage : null});
  }
  });

app.get('/dbtest', function (req, res) {
  // try to initialize the db on every request if it's not already initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

process.on('SIGTERM', function () {
    console.log('Cleanup.....');
    process.exit();
});
