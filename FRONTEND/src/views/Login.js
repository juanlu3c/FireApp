import { useState } from 'react'
import loginService from '../services/login'
import Notification from '../components/Notification'
import LoginForm from '../components/Forms/LoginForm'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import fire from '../assets/icons/fire.png'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    const user = await loginService.login({
      username,
      password
    })

    if (user) {
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))

      setUsername('')
      setPassword('')

      window.location.reload()
    } else {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Row className="justify-content-md-center" id="content">
        <Col lg="4">
            <img className="fireAppLogo" src={fire} alt=""></img>
            <h1 className='logoTitle'>FireApp</h1>
          <div>
            <Notification message={errorMessage} type={'error'} />
          </div>
          <div>
            <LoginForm // LoginForm ahora es un componente
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Login
