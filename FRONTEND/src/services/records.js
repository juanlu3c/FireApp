import axios from 'axios'
const baseUrl = process.env.REACT_APP_HEROKU_LINK + '/api/records' //"http://localhost:3001/api/records"

const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
//console.log("Pasamos")
const config = cookie
  ? {
      headers: {
        Authorization: 'Bearer ' + cookie.token
      }
    }
  : null

const getAll = async () => {
  try {
    const request = axios.get(baseUrl)
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

const remove = async (id) => {
  try {
    const request = axios.delete(`${baseUrl}/${id}`, config)
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

const exportedObject = {
  getAll,
  create,
  remove,
  update
}

export default exportedObject
