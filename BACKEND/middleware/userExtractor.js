/**
 * Name: userExtractor.js
 * Description: Middleware for getting users safely by tokens
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  // Header authorization of http
  const authorization = request.get('authorization')
  let token = null
  // HTTP Bearer Authorization writes in the header: Bearer .<token>
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7) // Token starts at header's character number 8
  }

  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, process.env.jwt_secret) // Token verification by JSON Web Tokens
  } catch (e) {
    console.log(e.name)
  }

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decodedToken
  request.userId = userId

  next()
}
