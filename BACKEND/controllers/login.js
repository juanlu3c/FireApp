/**
 * Name: login.js
 * Description: Back-End controller for managing the login functions in a safe encrypted way with Bearer tokens
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const jwt = require('jsonwebtoken') // Handling of user sessions through digitally signed tokens with the browser
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router() // Class that allows to make a router and distribute content outside index.js
const User = require('../models/User')

/**
 * Checks the encrypted credentials and if they are correct returns a cookie with the authentication token
 */
loginRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, password } = body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid user or password'
    })
  } else {
    const userForToken = {
      id: user._id,
      username: user.username
    }

    const token = jwt.sign(userForToken, process.env.jwt_secret)

    response.send({
      userId: user._id,
      token
    })
  }
})

module.exports = loginRouter
