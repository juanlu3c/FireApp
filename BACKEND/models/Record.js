/**
 * Name: Record.js
 * Description: Moongose schema and model for the Record collection in the database
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Id of user's schema
    ref: 'User' // Referenced model
  },
  date: String,
  location: String,
  status: String,
  alarmButton: Boolean,
  alarmDetector: Boolean
})

recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Record = mongoose.model('Record', recordSchema)

module.exports = Record
