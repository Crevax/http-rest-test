var express = require('express');
var moment = require('moment');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var server = express();

var logs = [];

var logHeaders = function(headers) {
    console.log('-------HEADERS-------')
    console.log(JSON.stringify(headers, null, 2))
    console.log('---------------------')
}

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
server.use(bodyParser.text());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.get('/logs', function(req, res) {
    res.json(logs);
})

server.delete('/logs', function(req, res) {
    logs = [];
    res.json({
        message: 'All logs cleared',
    });
})

server.get('/favicon.ico', function(req, res) {
    res.status(404).json({
        message: 'No favicon available for API endpoints.'
    })
})

server.all('/ping', function(req, res) {
    res.json({
        healthy: true,
        message: 'API is up'
    })
})

server.all('*', function(req, res) {
    var now = moment();
    var timestamp = now.format('MMMM Do YYYY, h:mm:ss a');
    var logMsg = `Request against ${req.method} ${req.originalUrl} at ${now}`;
    console.log(logMsg);
    logHeaders(req.headers);
    logs.unshift({
        message: logMsg,
        time: now.valueOf(),
        method: req.method,
        headers: req.headers,
        params: req.params,
        path: req.path,
        url: req.originalUrl,
        query: req.query,
        body: req.body
    });

    res.json({
        success: true,
        requestData: {
            method: req.method,
            headers: req.headers,
            params: req.params,
            path: req.path,
            url: req.originalUrl,
            query: req.query,
            body: req.body
        }
    });
})

server.listen(port, function() {
    console.log('listening on port ' + port);
})
