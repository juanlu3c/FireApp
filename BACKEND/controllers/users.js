/**
 * Name: users.js
 * Description: Back-End controller for managing the users collection in MongoDB database and fulfilling Front-End calls
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router() // Class that allows to make a router and distribute content outside index.js
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor.js')
const handleErrors = require('../middleware/handleErrors.js')

/**
 * Gets all the elements of the User collection of MongoDB and returns them in a json object
 */
usersRouter.get('/', userExtractor, async (request, response) => {
  const users = await User.find({}).populate('evacuationStatus', {
    latitude: 1,
    longitude: 1,
    status: 1
  })

  response.json(users)
})

/**
 * Gets a specific element given by its id of the User collection of MongoDB and returns it in a json object
 */
usersRouter.get('/:id', userExtractor, async (request, response, next) => {
  const user = await User.findById(request.params.id).catch((err) => {
    next(err)
  })
  response.json(user)
})

/**
 * Creates a new element of the User collection of MongoDB and returns it in a json object
 */
usersRouter.post('/', userExtractor, async (request, response, next) => {
  const { body } = request
  const { username, name, surname, position, password, isAdmin } = body

  // The password id hashed so that is not raw-saved in the database
  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    surname,
    position,
    passwordHash,
    isAdmin
  })

  try {
    await user.save()
    const userForToken = {
      id: user._id,
      username: user.username
    }
    const token = jwt.sign(userForToken, process.env.jwt_secret)

    response.send(token)
  } catch (error) {
    next(error)
  }
})

/**
 * Updates a specific element given by its id of the User collection of MongoDB and returns it in a json object
 */
usersRouter.put('/:id', userExtractor, async (request, response, next) => {
  const { body } = request
  const { username, name, surname, position, password, isAdmin } = body

  let newUserInfo = null

  console.log('Password is: ' + password)

  // If a password is not given, it remains the same as the previous one
  if (password) {
    const passwordHash = await bcrypt.hash(password, 10)

    newUserInfo = {
      username,
      passwordHash,
      name,
      surname,
      position,
      isAdmin
    }
  } else {
    newUserInfo = {
      username,
      name,
      surname,
      position,
      isAdmin
    }
  }

  try {
    // The third param is for returning the new value and not the old one
    User.findByIdAndUpdate(
      request.params.id,
      { $set: newUserInfo },
      { new: true }
    ).then((result) => {
      response.json(result)
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Deletes a specific element given by its id of the User collection of MongoDB
 */
usersRouter.delete('/:id', userExtractor, (request, response, next) => {
  User.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((err) => {
      next(err)
    })
})

usersRouter.use(handleErrors)

module.exports = usersRouter
