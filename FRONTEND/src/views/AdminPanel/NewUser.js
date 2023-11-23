import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import userService from '../../services/users'
import evacuationStatusService from '../../services/evacuationStatus'
import NewUserForm from '../../components/Forms/NewUserForm'
import Notification from '../../components/Notification'
import AdminMenu from './AdminMenu'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const NewUser = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [position, setPosition] = useState('')
  const [isAdmin, setAdmin] = useState(false)
  const [navigateBack, setNavigateBack] = useState(false)

  const [errorMessage, setErrorMessage] = useState(null)

  const handleCreate = async (event) => {
    event.preventDefault()
    let errorFlag = false

    if (username.length < 5) {
      setErrorMessage('The username must include at least 5 characters')
      errorFlag = true
    } else if (password.length < 5) {
      setErrorMessage('The password must include at least 5 characters')
      errorFlag = true
    } else if (name === '' || surname === '') {
      setErrorMessage('Name and surname must be introduced')
      errorFlag = true
    } else if (position === '') {
      setErrorMessage('Position must be introduced')
      errorFlag = true
    } else {
      const cookie = JSON.parse(
        window.localStorage.getItem('loggedNoteAppUser')
      )

      const users = await userService.getAll()
      try {
        users.forEach((element) => {
          if (element.username === username) {
            setErrorMessage('This username is already in use')
            errorFlag = true
          }
        })

        if (!errorFlag) {
          const token = await userService.create({
            username,
            password,
            name,
            surname,
            position,
            isAdmin
          })

          // Create associated evacuation status object
          const evacuationStatusObject = {
            latitude: '',
            longitude: '',
            status: null
          }
          evacuationStatusService.setToken(token)
          evacuationStatusService.create(evacuationStatusObject).then(() => {
            evacuationStatusService.setToken(cookie.token)
            // Get back to original user token
            setUsername('')
            setPassword('')
            setName('')
            setSurname('')
            setPosition('')
            setAdmin(false)
            setNavigateBack(true)
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <>
      <div>
        <p />
        <AdminMenu />
      </div>
      <Row className="justify-content-md-center" id="content">
        <Col lg="9">
          <h1>Create new user</h1>
          <div>
            <NewUserForm
              type="New"
              username={username}
              password={password}
              name={name}
              surname={surname}
              position={position}
              isAdmin={isAdmin}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleNameChange={({ target }) => setName(target.value)}
              handleSurnameChange={({ target }) => setSurname(target.value)}
              handlePositionChange={({ target }) => setPosition(target.value)}
              handleAdminChange={({ target }) => setAdmin(target.checked)}
              handleSubmit={handleCreate}
            />
          </div>
          {navigateBack ? (
            <Navigate to="/admin/usermanager/newsuccess" replace={true} />
          ) : (
            <></>
          )}
          <p />
          <div>
            <Notification message={errorMessage} type={'error'} />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default NewUser
