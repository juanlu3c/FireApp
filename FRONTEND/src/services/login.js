import axios from 'axios'

const baseUrl = process.env.REACT_APP_HEROKU_LINK + '/api/login' //"http://localhost:3001/api/login"

const login = async (credentials) => {
  try {
    const { data } = await axios.post(baseUrl, credentials)
    return data
  } catch {
    console.log('Loading...')
  }
}

export default { login } // eslint-disable-line
