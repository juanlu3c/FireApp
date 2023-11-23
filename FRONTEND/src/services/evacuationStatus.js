import axios from 'axios'
const baseUrl = process.env.REACT_APP_HEROKU_LINK + '/api/evacuationstatus' //"http://localhost:3001/api/evacuationstatus"

const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
//console.log("Pasamos")
let config = cookie
  ? {
      headers: {
        Authorization: 'Bearer ' + cookie.token
      }
    }
  : null

const setToken = (token) => {
  config = {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }
  return config
}

const getAll = async () => {
  try {
    const request = axios.get(baseUrl, config)
    const response = await request
    return response.data
  } catch {
    console.log('Loading...')
  }
}

const getStatus = async (id) => {
  try {
    const request = axios.get(`${baseUrl}/${id}`, config)
    const response = await request
    return response.data
  } catch {
    console.log('Loading...')
  }
}

const create = async (newObject) => {
  try {
    const request = axios.post(baseUrl, newObject, config)
    const response = await request
    return response.data
  } catch {
    console.log('Loading...')
  }
}

const update = async (id, newObject) => {
  try {
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    const response = await request
    return response.data
  } catch {
    console.log('Loading...')
  }
}

const setAllStatus = (status) => {
  try {
    const request = axios.get(baseUrl, config)
    request.then((response) => {
      response.data.forEach((element) => {
        element.status = status
        update(element.id, element)
      })
    })
  } catch {
    console.log('Loading...')
  }
}

const exportedObject = {
  getAll,
  getStatus,
  create,
  update,
  setAllStatus,
  setToken
}

export default exportedObject
