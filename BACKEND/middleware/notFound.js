/**
 * Name: notFound.js
 * Description: Not found middleware
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
module.exports = (request, response) => {
  response.status(404).end()
}
