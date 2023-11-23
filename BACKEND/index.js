/**
 * Name: index.js
 * Description: Main script
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
require('dotenv').config() // Read environment variables from .env
require('./mongo.js') // Execute all mongo.js script directly

const express = require('express') // Load common.js module
const app = express()
const cors = require('cors')

const logger = require('./middleware/loggerMiddleware')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

const http = require('http')
const { Server } = require('socket.io')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const recordsRouter = require('./controllers/records')
const evacuationStatusRouter = require('./controllers/evacuationStatus')
const fireLocationRouter = require('./controllers/fireLocation')

app.use(cors())
app.use(express.json())

// LOGGER MIDDLEWARE
app.use(logger)

// ENDPOINT CONTROLLERS
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/records', recordsRouter)
app.use('/api/evacuationstatus', evacuationStatusRouter)
app.use('/api/firelocation', fireLocationRouter)

// ERROR CONTROL MIDDLEWARE
app.use(handleErrors)
app.use(notFound)

// SOCKET.IO
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Socket connection for sending messages between server and clients in a bidirectional way
// Open socket
io.on('connection', (socket) => {
  // Listen for send_alarm_request type messages
  socket.on('send_alarm_request', (data) => {
    socket.broadcast.emit('receive_message', data) // Send receive_message type message in broadcast mode (to all clients connected)
  })
  socket.on('send_reload_request', () => {
    socket.broadcast.emit('reload_message')
  })
})

const PORT = process.env.PORT || 3001 // Heroku decides the port or 3001 by default (for localhost)

server.listen(PORT, () => {
  console.log('Server running on port', PORT)
})
