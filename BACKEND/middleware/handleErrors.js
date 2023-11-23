/**
 * Name: handleErrors.js
 * Description: Custom error handler middleware (returned the default if not customized)
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const ERROR_HANDLERS = {
  CastError: (res) => res.status(400).send({ error: 'id used is malformed' }),
  ValidationError: (res, error) =>
    res.status(409).send({
      error: error.message
    }),
  JsonWebTokenError: (res) =>
    res.status(401).json({
      error: 'Token missing or invalid'
    }),
  defultError: (res) => res.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.error(error.name)
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defultError
  handler(response, error)
}
