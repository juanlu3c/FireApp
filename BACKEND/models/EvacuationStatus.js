/**
 * Name: EvacuationStatus.js
 * Description: Moongose schema and model for the EvacuationStatus collection in the database
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const mongoose = require('mongoose')

const evacuationStatusSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  status: String,
  user: {
    type: mongoose.Schema.Types.ObjectId, // Id of user's schema
    ref: 'User' // Referenced model
  }
})

// We need to change the way in which the default toJSON function is executed for
// making the returned _id the real id of the schema and also delete _id and __v
evacuationStatusSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Model: create a class using the schema which can create instances of that same schema
const EvacuationStatus = mongoose.model(
  'EvacuationStatus',
  evacuationStatusSchema
)

module.exports = EvacuationStatus
