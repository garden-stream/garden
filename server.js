let express = require('express')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let routes = require('./routes/')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/garden')

mongoose.connection.on('connected', () => {
  console.log('[mongo] database connected')
})

let app = express()
let server = require('http').Server(app)

app.use(express.static('static'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token")
  next();
});

app.use('/api', routes(express));

server.listen(app.get('port') || 3000, app.get('ip') || '0.0.0.0', function () {
  console.log(`[garden] api listening at ${server.address().address === '0.0.0.0' ? 'localhost' : server.addres().address}:${server.address().port}...`)
})