/**
 * Name: evacuationStatus.js
 * Description: Back-End controller for managing the evacuationstatuses collection in MongoDB database and fulfilling Front-End calls
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const evacuationStatusRouter = require('express').Router() // Class that allows to make a router and distribute content outside index.js
const userExtractor = require('../middleware/userExtractor.js')
const handleErrors = require('../middleware/handleErrors.js')
const EvacuationStatus = require('../models/EvacuationStatus')
const User = require('../models/User')

/**
 * Gets all the elements of the EvacuationStatus collection of MongoDB and returns them in a json object
 */
evacuationStatusRouter.get('/', userExtractor, async (request, response) => {
  const evacuationStatus = await EvacuationStatus.find({}).populate('user', {
    username: 1,
    name: 1
  })

  response.json(evacuationStatus)
})

/**
 * Gets a specific element given by its id of the EvacuationStatus collection of MongoDB and returns it in a json object
 */
evacuationStatusRouter.get(
  '/:id',
  userExtractor,
  async (request, response, next) => {
    const evacuationStatus = await EvacuationStatus.findById(
      request.params.id
    ).catch((err) => {
      next(err)
    })
    response.json(evacuationStatus)
  }
)

/**
 * Creates a new element of the EvacuationStatus collection of MongoDB and returns it in a json object
 */
evacuationStatusRouter.post(
  '/',
  userExtractor,
  async (request, response, next) => {
    const { latitude, longitude, status } = request.body

    const { userId } = request
    const user = await User.findById(userId)

    const newEvacuationStatus = new EvacuationStatus({
      latitude,
      longitude,
      status,
      user: user._id
    })

    try {
      const savedEvacuationStatus = await newEvacuationStatus.save()

      user.evacuationStatus = savedEvacuationStatus._id
      await user.save()

      response.json(savedEvacuationStatus)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * Updates a specific element given by its id of the EvacuationStatus collection of MongoDB and returns it in a json object
 */
evacuationStatusRouter.put('/:id', userExtractor, (request, response, next) => {
  const evacuationStatus = request.body

  const newEvacuationStatusInfo = {
    latitude: evacuationStatus.latitude,
    longitude: evacuationStatus.longitude,
    status: evacuationStatus.status
  }

  EvacuationStatus.findByIdAndUpdate(
    request.params.id,
    newEvacuationStatusInfo,
    { new: true }
  ).then((result) => {
    response.json(result)
  })
})

evacuationStatusRouter.use(handleErrors)

module.exports = evacuationStatusRouter
