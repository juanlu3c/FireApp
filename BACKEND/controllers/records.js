/**
 * Name: records.js
 * Description: Back-End controller for managing the records collection in MongoDB database and fulfilling Front-End calls
 * Author: Juan Luis Sanz Calvar
 * FireApp - TFG - EPS - UAM
 */
const recordsRouter = require('express').Router() // Class that allows to make a router and distribute content outside index.js
const userExtractor = require('../middleware/userExtractor.js')
const handleErrors = require('../middleware/handleErrors.js')
const User = require('../models/User')
const Record = require('../models/Record')

/**
 * Gets all the elements of the Records collection of MongoDB and returns them in a json object
 */
recordsRouter.get('/', async (request, response) => {
  const records = await Record.find({}).populate('user', {
    username: 1,
    name: 1
  })

  response.json(records)
})

/**
 * Creates a new element of the Records collection of MongoDB and returns it in a json object
 */
recordsRouter.post('/', userExtractor, async (request, response, next) => {
  const { location } = request.body
  const { status } = request.body
  const { alarmButton } = request.body
  const { alarmDetector } = request.body

  const { userId } = request // Pass through the request by the userExtractor middleware
  const user = await User.findById(userId)

  const userRecord = alarmButton ? null : alarmDetector ? null : user._id

  const newDate = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })

  const record = new Record({
    user: userRecord,
    date: newDate,
    location,
    status,
    alarmButton,
    alarmDetector
  })

  try {
    const savedRecord = await record.save()
    response.json(savedRecord)
  } catch (error) {
    next(error)
  }
})

/**
 * Deletes a specific element given by its id of the Records collection of MongoDB
 */
recordsRouter.delete('/:id', userExtractor, (request, response, next) => {
  Record.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((err) => {
      next(err)
    })
})

/**
 * Updates a specific element given by its id of the Records collection of MongoDB and returns it in a json object
 */
recordsRouter.put('/:id', userExtractor, (request, response, next) => {
  const record = request.body

  const newRecordInfo = {
    status: record.status
  }

  // The third param is for returning the new value and not the old one
  Record.findByIdAndUpdate(request.params.id, newRecordInfo, {
    new: true
  }).then((result) => {
    response.json(result)
  })
})

recordsRouter.use(handleErrors)

module.exports = recordsRouter
