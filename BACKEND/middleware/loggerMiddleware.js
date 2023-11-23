/**
 * Name: loggerMiddleware.js
 * Description: Middleware to log server info
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const logger = (request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('------')
  next() // Pass to the next middleware instead of returning response to the client
}

module.exports = logger
