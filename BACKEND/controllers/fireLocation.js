/**
 * Name: firelocation.js
 * Description: Back-End controller for managing the firelocation collection in MongoDB database and fulfilling Front-End calls
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const fireLocationRouter = require('express').Router() // Class that allows to make a router and distribute content outside index.js
const userExtractor = require('../middleware/userExtractor.js')
const handleErrors = require('../middleware/handleErrors.js')
const FireLocation = require('../models/FireLocation')

/**
 * Gets all the elements of the FireLocation collection of MongoDB and returns them in a json object
 */
fireLocationRouter.get('/', userExtractor, async (request, response) => {
  const fireLocation = await FireLocation.find({})

  response.json(fireLocation)
})

/**
 * Creates a new element of the FireLocation collection of MongoDB and returns it in a json object
 */
fireLocationRouter.post('/', userExtractor, async (request, response, next) => {
  const { name, left, width, height, top } = request.body

  const newFireLocation = new FireLocation({
    name,
    left,
    width,
    height,
    top
  })

  try {
    const savedFireLocation = await newFireLocation.save()
    response.json(savedFireLocation)
  } catch (error) {
    next(error)
  }
})

/**
 * Updates a specific element given by its id of the FireLocation collection of MongoDB and returns it in a json object
 */
fireLocationRouter.put('/:id', userExtractor, (request, response, next) => {
  const fireLocation = request.body

  const newFireLocationInfo = {
    name: fireLocation.name,
    left: fireLocation.left,
    width: fireLocation.width,
    height: fireLocation.height,
    top: fireLocation.top
  }

  FireLocation.findByIdAndUpdate(request.params.id, newFireLocationInfo, {
    new: true
  }).then((result) => {
    response.json(result)
  })
})

/**
 * Deletes a specific element given by its id of the FireLocation collection of MongoDB
 */
fireLocationRouter.delete('/:id', userExtractor, (request, response, next) => {
  FireLocation.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((err) => {
      next(err)
    })
})

fireLocationRouter.use(handleErrors)

module.exports = fireLocationRouter
