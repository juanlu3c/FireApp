/**
 * Name: FireLocation.js
 * Description: Moongose schema and model for the FireLocation collection in the database
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const mongoose = require('mongoose')

const fireLocationSchema = new mongoose.Schema({
  name: String,
  left: String,
  width: String,
  height: String,
  top: String
})

// We need to change the way in which the default toJSON function is executed for
// making the returned _id the real id of the schema and also delete _id and __v
fireLocationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Model: create a class using the schema which can create instances of that same schema
const FireLocation = mongoose.model('FireLocation', fireLocationSchema)

module.exports = FireLocation
