import React, { useEffect, useState } from 'react'
import userService from '../../services/users'
import NewUserForm from '../../components/Forms/NewUserForm'
import Notification from '../../components/Notification'
import AdminMenu from './AdminMenu'
import { useParams, Navigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const EditUser = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [position, setPosition] = useState('')
  const [isAdmin, setAdmin] = useState(false)
  const [user, setUser] = useState()
  const [errorMessage, setErrorMessage] = useState(null)
  const [navigateBack, setNavigateBack] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    userService.getUser(id).then((userReceived) => {
      try {
        setUser(userReceived)
      } catch {
        console.log('Loading...')
      }
    })
  }, [id])

  const handleUpdate = async (event) => {
    event.preventDefault()
    let errorFlag = false

    const newUsername = username === '' ? user.username : username
    const newName = name === '' ? user.name : name
    const newSurname = surname === '' ? user.surname : surname
    const newPosition = position === '' ? user.position : position

    if (newUsername.length < 5) {
      setErrorMessage('The username must include at least 5 characters')
      errorFlag = true
    } else if (password.length < 5 && password !== '') {
      setErrorMessage('The password must include at least 5 characters')
      errorFlag = true
    } else if (newName === '' || newSurname === '') {
      setErrorMessage('Name and surname must be introduced')
      errorFlag = true
    } else if (newPosition === '') {
      setErrorMessage('Position must be introduced')
      errorFlag = true
    } else {
      const users = await userService.getAll()
      try {
        users.forEach((element) => {
          if (element.username === username && element.id !== id) {
            setErrorMessage('This username is already in use')
            errorFlag = true
          }
        })

        if (!errorFlag) {
          userService
            .update(id, {
              username: newUsername,
              name: newName,
              password: password !== '' ? password : null,
              surname: newSurname,
              position: newPosition,
              isAdmin: isAdmin
            })
            .then(() => setNavigateBack(true))
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
          {user ? (
            <>
              <p />
              <h1>Edit user {user.username}</h1>
              <div>
                <NewUserForm
                  type="Edit"
                  username={user.username}
                  password={user.password}
                  name={user.name}
                  surname={user.surname}
                  position={user.position}
                  isAdmin={user.isAdmin}
                  handleUsernameChange={({ target }) =>
                    setUsername(target.value)
                  }
                  handlePasswordChange={({ target }) =>
                    setPassword(target.value)
                  }
                  handleNameChange={({ target }) => setName(target.value)}
                  handleSurnameChange={({ target }) => setSurname(target.value)}
                  handlePositionChange={({ target }) =>
                    setPosition(target.value)
                  }
                  handleAdminChange={({ target }) => setAdmin(target.checked)}
                  handleSubmit={handleUpdate}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          {navigateBack ? (
            <Navigate to="/admin/usermanager/editsuccess" replace={true} />
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

export default EditUser
