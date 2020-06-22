require('dotenv').config();
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const startBot = require('./CollectData').startBot
const router = require('../Controller/Route').rest
const cors = require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
router(app)

// Server Setup
const port = process.env.PORT || 4000
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port)
startBot()
