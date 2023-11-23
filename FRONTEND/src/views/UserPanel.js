import { useEffect, useState } from 'react'
import userService from '../services/users'
import profilepicture from '../assets/images/profilepicture.png'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const UserPanel = () => {
  const [user, setUser] = useState()

  const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))

  useEffect(() => {
    if (cookie) {
      userService.getUser(cookie.userId).then((userReceived) => {
        try {
          setUser(userReceived)
        } catch {
          console.log('Loading...')
        }
      })
    }
  }, [cookie])

  return (
    <>
      {user ? (
        <>
          <Row className="" id="content">
            <h1>This is a user panel</h1>
            <Col lg="auto">
              <br />
              <img className="profilepicture" alt="" src={profilepicture} />
            </Col>
            <Col lg="auto">
              <br />
              <div>
                <h2 className="userpanellabel">Name: </h2>{' '}
                <label className="userpanelsubtitlelabel">{user.name}</label>
                <br />
                <br />
              </div>
              <div>
                <h2 className="userpanellabel">Surname: </h2>{' '}
                <label className="userpanelsubtitlelabel">{user.surname}</label>
                <br />
                <br />
              </div>
              <div>
                <h2 className="userpanellabel">Position: </h2>{' '}
                <label className="userpanelsubtitlelabel">
                  {user.position}
                </label>
                <br />
                <br />
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default UserPanel
