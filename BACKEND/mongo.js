/**
 * Name: mongo.js
 * Description: Script for connecting to the mongodb database
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const mongoose = require('mongoose')

// Saved in environment variable for security reasons
const connectionString = process.env.CONNECTION_STRING

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.error(err)
  })
