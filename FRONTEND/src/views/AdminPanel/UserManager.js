import { useState, useEffect } from 'react'
import AdminMenu from './AdminMenu'
import User from '../../components/AdminPanel/User'
import userService from '../../services/users'
import Notification from '../../components/Notification'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UserManager = ({ success }) => {
  const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const [users, setUsers] = useState([])
  const [successMessage, setSuccessMessage] = useState()

  useEffect(() => {
    if(success === 'editsuccess'){
      setSuccessMessage("User successfully edited")
    } else if (success === 'newsuccess'){
      setSuccessMessage("User successfully created")
    }
    
    setTimeout(() => {
      setSuccessMessage(null)
    }, 4000)
  }, [success])

  useEffect(() => {
    userService.getAll().then((initialUsers) => {
      try {
        setUsers(initialUsers)
      } catch {
        console.log('Loading...')
      }
    })
    return () => {
      setUsers()
    }
  }, [])

  const refreshUsersList = () => {
    userService.getAll().then((newUsers) => {
      try {
        setUsers(newUsers)
      } catch {
        console.log('Loading...')
      }
    })
  }

  return (
    <>
      <div>
        <p />
        <AdminMenu />
      </div>
      <Row className="justify-content-md-center" id="content">
        <Col lg="9">
          <div>
            <h1>List of users</h1>
            {success === 'editsuccess' ? (
              <Notification
                message={successMessage}
                type={'success'}
              />
            ) : (
              <>
                {success === 'newsuccess' ? (
                  <Notification
                    message={successMessage}
                    type={'success'}
                  />
                ) : (
                  <></>
                )}
              </>
            )}
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name and Surname</th>
                  <th>Position</th>
                  <th>Is Admin</th>
                  <th>Delete</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {users ? (
                  users
                    .sort((a, b) => {
                      if (a.name === b.name) {
                        return 0
                      }
                      if (a.name < b.name) {
                        return -1
                      }
                      return 1
                    })
                    .filter((user) => user.id !== cookie.userId)
                    .map((user, i) => (
                      <tr key={i}>
                        <User user={user} callRefresh={refreshUsersList} />
                      </tr>
                    ))
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
            <Button variant="secondary" href="/admin/usermanager/newuser">
              New User
            </Button>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default UserManager
