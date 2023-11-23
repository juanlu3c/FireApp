/**
 * Name: User.js
 * Description: Moongose schema and model for the User collection in the database
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  surname: String,
  position: String,
  passwordHash: String,
  isAdmin: Boolean,
  evacuationStatus: {
    type: mongoose.Schema.Types.ObjectId, // Id of evacuationStatus's schema
    ref: 'EvacuationStatus' // Referenced model
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash // Don't return password for security (eventhough that is hashed)
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
