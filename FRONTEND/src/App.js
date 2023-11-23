import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import addNotification from 'react-push-notification'
import currentUser from './services/currentUser'
import recordService from './services/records'
import evacuationStatusService from './services/evacuationStatus'
import Home from './views/Home'
import Login from './views/Login'
import Map from './views/Map'
import UserPanel from './views/UserPanel'
import About from './views/About'
import Help from './views/Help'
import ComponentNotification from './components/Notification'
import Alarms from './views/AdminPanel/Alarms'
import Records from './views/AdminPanel/Records'
import UserManager from './views/AdminPanel/UserManager'
import NewUser from './views/AdminPanel/NewUser'
import EditUser from './views/AdminPanel/EditUser'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import fire from './assets/icons/fire.png'
import fireAlarm from './assets/sounds/fireAlarm.wav'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const socket = io.connect(process.env.REACT_APP_HEROKU_LINK) //("http://localhost:3001")

const PageNotFound = () => {
  return <h1>404 Page not found</h1>
}

const useAudio = (url) => {
  const [audio] = useState(new Audio(url))
  const [playing, setPlaying] = useState(false)

  const toggle = () => setPlaying(!playing)

  useEffect(() => {
    playing ? audio.play() : audio.pause()
    audio.loop = true
  }, [audio, playing])

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false))
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false))
    }
  }, [audio])

  return [playing, toggle]
}

const App = () => {
  const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const [redirect, setRedirect] = useState()
  const [infoMessage, setInfoMessage] = useState(null)
  const [emergencyMessage, setEmergencyMessage] = useState(null)

  const [playing, toggle] = useAudio(fireAlarm)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    window.location.reload(false)
  }

  // Keep state value for redirection when reloading
  useEffect(() => {
    recordService.getAll().then((array) => {
      try {
        if (
          array.filter((element) => element.status === 'Confirmed').length > 0
        ) {
          setRedirect(true)
        } else {
          setRedirect(false)
        }
      } catch {
        console.log('Loading...')
      }
    })
  }, [])

  // Make notifications appear and disappear, make redirections effective, create new records
  // and fire alarms when a button is pressed or detector is activated
  useEffect(() => {
    try {
      socket.on('receive_message', (data) => {
        if (data.status === 'Confirmed') {
          if (data.alarmButton) {
            const locationObject = {
              location: '40.54728991109466, -3.6912506818771362',
              status: 'Confirmed',
              alarmButton: true,
              alarmDetector: false
            }
            recordService.create(locationObject).then(() => {
              setRedirect(true)
              setInfoMessage(null)
              setEmergencyMessage(
                'Alarm sounding, please follow the evacuation routes immediately'
              )
            })
          } else if (data.alarmDetector) {
            const locationObject = {
              location: '40.546808912983764, -3.6922645568847656',
              status: 'Confirmed',
              alarmButton: false,
              alarmDetector: true
            }
            recordService.create(locationObject).then(() => {
              setRedirect(true)
              setInfoMessage(null)
              setEmergencyMessage(
                'Alarm sounding, please follow the evacuation routes immediately'
              )
            })
          } else {
            setRedirect(true)
            setInfoMessage(null)
            setEmergencyMessage(
              'Alarm sounding, please follow the evacuation routes immediately'
            )
          }
          // Show a desktop/push notification
          const options = {
            title: 'FireApp',
            subtitle: 'Alarm',
            message:
              'Alarm sounding, please follow the evacuation routes immediately',
            icon: fire,
            vibrate: [200, 100, 200],
            native: true
          }
          addNotification(options)
          toggle(true)
          // All the users become not evacuated
          evacuationStatusService.setAllStatus('Not evacuated')
        } else if (data.status === 'Pending') {
          setInfoMessage(
            'Alarm triggered: Waiting for confirmation from administrator'
          )
        } else {
          toggle(false)
          setRedirect(false)
          setInfoMessage(null)
          setEmergencyMessage(null)
        }
      })

      socket.on('reload_message', () => {
        // Escuchamos mensajes del tipo send_alarm_request
        window.location.reload()
      })
    } catch {
      console.log('Loading...')
    }
  }, []) // eslint-disable-line

  // Keep notifications appearing when reloading or changing page
  useEffect(() => {
    recordService.getAll().then((array) => {
      try {
        if (
          array.filter((element) => element.status === 'Confirmed').length > 0
        ) {
          // An alarm is active
          setEmergencyMessage(
            'Alarm sounding, please follow the evacuation routes immediately'
          )
          toggle(true)
        } else if (
          array.filter((element) => element.status === 'Pending').length > 0
        ) {
          setInfoMessage(
            'Alarm triggered: Waiting for confirmation from administrator'
          )
        }
      } catch {
        console.log('Loading...')
      }
    })
    return () => {
      setInfoMessage()
      setEmergencyMessage()
    }
  }, []) // eslint-disable-line

  return (
    <>
      {cookie ? (
        <>
          <Container fluid>
            <BrowserRouter>
              <Row className="justify-content-md-center" id="header">
                <Col lg="10">
                  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="/">
                      <img
                        alt=""
                        src={fire}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                      />{' '}
                      FireApp
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse>
                      <Nav className="container-fluid">
                        <Nav.Link className="navlinkspace" href="/">
                          Home
                        </Nav.Link>
                        <Nav.Link className="navlinkspace" href="/map">
                          Map
                        </Nav.Link>
                        {currentUser.user ? (
                          currentUser.user.isAdmin ? (
                            <Nav.Link className="navlinkspace" href="/admin">
                              Admin Panel
                            </Nav.Link>
                          ) : (
                            <Nav.Link className="navlinkspace" href="/user">
                              User Panel
                            </Nav.Link>
                          )
                        ) : (
                          <></>
                        )}
                        <Nav.Link className="navlinkspace" href="/about">
                          About
                        </Nav.Link>

                        <Nav.Link className="navlinkspace" href="/help">
                          Help
                        </Nav.Link>
                        <Nav.Item className="ms-auto"></Nav.Item>
                        <Nav.Item className="ms-auto">
                          {emergencyMessage ? (
                            <Button onClick={toggle}>
                              {playing ? 'Mute Alarm' : 'Unmute alarm'}
                            </Button>
                          ) : (
                            <></>
                          )}
                          {'   '}
                          <Button variant="secondary" onClick={handleLogout}>
                            Logout
                          </Button>
                        </Nav.Item>
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>
                </Col>
              </Row>

              <Row className="justify-content-md-center" id="notification">
                <Col lg="10">
                  <ComponentNotification message={infoMessage} type={'info'} />
                  <ComponentNotification
                    message={emergencyMessage}
                    type={'emergency'}
                  />
                </Col>
              </Row>

              <Row className="justify-content-md-center" id="content">
                <Col lg="10">
                  {cookie ? (
                    <Routes>
                      <Route
                        exact
                        path="/"
                        element={redirect ? <Navigate to="/map" /> : <Home />}
                      />
                      <Route exact path="/map" element={<Map />} />
                      <Route exact path="/about" element={<About />} />
                      <Route exact path="/help" element={<Help />} />
                      <Route
                        exact
                        path="/login"
                        element={<Navigate to="/" replace={true} />}
                      />
                      <Route
                        exact
                        path="/user"
                        element={
                          redirect ? (
                            <Navigate to="/map" />
                          ) : currentUser.user ? (
                            !currentUser.user.isAdmin ? (
                              <UserPanel />
                            ) : (
                              <h1>Forbidden: Access restricted to users</h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <Navigate to="/admin/alarms" />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin/alarms"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <Alarms />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin/records"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <Records />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin/usermanager"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <UserManager />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin/usermanager/editsuccess"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <UserManager success="editsuccess" />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin/usermanager/newsuccess"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <UserManager success="newsuccess" />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin/usermanager/newuser"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <NewUser />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/admin/usermanager/edituser/:id"
                        element={
                          currentUser.user ? (
                            currentUser.user.isAdmin ? (
                              <EditUser />
                            ) : (
                              <h1>
                                Forbidden: Access restricted to administrators
                              </h1>
                            )
                          ) : (
                            <></>
                          )
                        }
                      />
                      <Route
                        path="*"
                        element={
                          redirect ? <Navigate to="/map" /> : <PageNotFound />
                        }
                      />
                    </Routes>
                  ) : (
                    <Routes>
                      <Route
                        exact
                        path="/map"
                        element={<Navigate to="/login" />}
                      />
                      <Route exact path="/about" element={<About />} />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  )}
                </Col>
              </Row>
            </BrowserRouter>
          </Container>
        </>
      ) : (
        <>
          <Container fluid>
            <BrowserRouter>
              <Row className="justify-content-md-center" id="header">
                <Col lg="10">
                  <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to={'/login'} />} />
                  </Routes>
                </Col>
              </Row>
            </BrowserRouter>
          </Container>
        </>
      )}
    </>
  )
}

export default App
