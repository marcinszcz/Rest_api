const express = require('express')
var bodyParser = require('body-parser')
var r = require('rethinkdb')
var config = require('/home/mr/Studia/VI/II/REST_API/config.js')
var app = express()

function createConnection (req, res, next) {
  r.connect(config.rethinkdb).then(function(conn) {
    req._rdbConn = conn
    next()
  }).error(handleError(res))
}

r.connect(config.rethinkdb, function(err, conn) {
  if (err) {
    console.log('Could not open a connection to initialize the database')
    console.log(err.message)
    process.exit(1)
  }

  r.table('new1').run(conn).finally(function() {
    return r.tableCreate('new1').run(conn)
  })
})




app.get('/', function (req, res) {
  res.json({ message: 'welcome to our api!' })
})

app.listen(config.express.port)
console.log('Server running on port ' + config.express.port)
