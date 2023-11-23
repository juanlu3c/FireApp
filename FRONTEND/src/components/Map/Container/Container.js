import './styles.css'
import io from 'socket.io-client'
import Notification from '../../Notification'
import location from '../../../services/location'
import fireLocationService from '../../../services/fireLocation'
import evacuationStatusService from '../../../services/evacuationStatus'
import clickPositionService from '../../../services/clickPosition'
import currentUser from '../../../services/currentUser'
import recordService from '../../../services/records'
import userService from '../../../services/users'
import locationDot from '../../../assets/icons/locationDot.png'
import fire from '../../../assets/icons/fire.png'
import sector1arrow from '../../../assets/mapassets/sector1arrow.gif'
import sector3arrow from '../../../assets/mapassets/sector3arrow.gif'
import sector51arrow from '../../../assets/mapassets/sector51arrow.gif'
import sector521arrow from '../../../assets/mapassets/sector521arrow.gif'
import sector522arrow from '../../../assets/mapassets/sector522arrow.gif'
import sector7arrow from '../../../assets/mapassets/sector7arrow.gif'
import sector9arrow from '../../../assets/mapassets/sector9arrow.gif'
import refresh from '../../../assets/icons/refresh.png'
import button from '../../../assets/icons/button.png'
import detector from '../../../assets/icons/detector.png'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import UserStatus from '../UserStatus'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const socket = io.connect(process.env.REACT_APP_HEROKU_LINK) //("http://localhost:3001")

const MySwal = withReactContent(Swal)

const Container = () => {
  const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const [, setTime] = useState(Date.now())
  const [firstAccess, setFirstAccess] = useState()
  const [users, setUsers] = useState([])
  const [counter, setCounter] = useState(0)
  const [update, setUpdate] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  var dict = []

  const ref = useRef(null)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth)
    setHeight(ref.current.offsetHeight)
  }, [])

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

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    fireLocationService
      .getAll()
      .then((received) => {
        try {
          received.forEach((element) => {
            var newLeft = (element.left * ref.current.offsetWidth / element.width) + "px"
            var newTop = (element.top * ref.current.offsetHeight / element.height) + "px"
            //console.log(element.left, ref.current.offsetWidth, element.width)
            //console.log(newLeft, newTop)
            var theThing = document.getElementById(element.name)
            theThing.style.left = newLeft
            theThing.style.top = newTop
          })
        } catch {
          console.log('Loading...')
        }
      })
      .then(() => {
        for (let i = 1; i < 11; i++) {
          let name = 'fire' + i.toString()
          var theThing = document.getElementById(name)

          if (!theThing.style.left && !theThing.style.bottom) {
            theThing.style.visibility = 'hidden'
          } else {
            theThing.style.visibility = 'visible'
          }
        }
      })
  }, [])

  // Check if alarm button or smoke detector had been activated (refresh-proof)
  useEffect(() => {
    recordService.getAll().then((received) => {
      try {
        var button = document.getElementById('alarmButton')
        var detector = document.getElementById('alarmDetector')
        var alarm = received.filter((element) => element.status === 'Confirmed')
        if (button !== null && detector !== null) {
          if (alarm.length > 0) {
            if (alarm[0].alarmButton) {
              button.style.visibility = 'visible'
              detector.style.visibility = 'hidden'
            } else if (alarm[0].alarmDetector) {
              button.style.visibility = 'hidden'
              detector.style.visibility = 'visible'
            } else {
              button.style.visibility = 'hidden'
              detector.style.visibility = 'hidden'
            }
          } else {
            button.style.visibility = 'hidden'
            detector.style.visibility = 'hidden'
          }
        }
      } catch {
        console.log('Loading...')
      }
    })
  }, [])

  useEffect(() => {
    const previousLatitude = location.latitude
    const previousLongitude = location.longitude

    navigator.permissions &&
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(function (PermissionStatus) {
          if (
            PermissionStatus.state !== 'granted' &&
            PermissionStatus.state !== 'prompt'
          ) {
            setErrorMessage('Please, allow location access in your browser')
          }
        })

    navigator.geolocation.getCurrentPosition(
      function (position) {
        location.latitude = position.coords.latitude
        location.longitude = position.coords.longitude

        if (
          previousLatitude !== location.latitude ||
          previousLongitude !== location.longitude ||
          firstAccess !== false
        ) {
          userDotLocation()
        }

        // Update evacuation status' coordinates in users schema
        if (currentUser.user) {
          const evacuationStatusObject = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            status: currentUser.user.evacuationStatus.status
          }

          evacuationStatusService.update(
            currentUser.user.evacuationStatus,
            evacuationStatusObject
          )
        }
      },
      function (err) {
        console.log(
          'error while attempting to get geolocation info:',
          err.code,
          err
        )
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    )
  })

  const refreshUserList = () => {
    setUpdate(update + 1) // Refresh only the user list component by a useState
  }

  const changeArrows = (newMarginLeft, newMarginBottom) => {
    hideArrowIcons()
    newMarginLeft = 1800 * newMarginLeft / width
    newMarginBottom = 600 * newMarginBottom / height
    if (newMarginLeft <= 370 && newMarginBottom >= 300) {
      document.getElementById('sector1arrow').style.visibility = 'visible'
    } else if (
      newMarginLeft > 370 &&
      newMarginLeft <= 740 &&
      newMarginBottom >= 300
    ) {
      document.getElementById('sector2arrow').style.visibility = 'visible'
    } else if (
      (newMarginLeft > 740 && newMarginLeft <= 1060) ||
      (newMarginLeft > 740 && newMarginLeft <= 1153 && newMarginBottom < 300)
    ) {
      document.getElementById('sector5arrow').style.visibility = 'visible'
      document.getElementById('sector10arrow').style.visibility = 'visible'
      document.getElementById('sector11arrow').style.visibility = 'visible'
    } else if (
      newMarginLeft > 1060 &&
      newMarginLeft <= 1430 &&
      newMarginBottom >= 300
    ) {
      document.getElementById('sector6arrow').style.visibility = 'visible'
    } else if (
      newMarginLeft > 1430 &&
      newMarginLeft <= 1800 &&
      newMarginBottom >= 300
    ) {
      document.getElementById('sector7arrow').style.visibility = 'visible'
    } else if (newMarginLeft <= 370 && newMarginBottom < 300) {
      document.getElementById('sector3arrow').style.visibility = 'visible'
    } else if (
      newMarginLeft > 370 &&
      newMarginLeft <= 740 &&
      newMarginBottom < 300
    ) {
      document.getElementById('sector4arrow').style.visibility = 'visible'
    } else if (
      newMarginLeft > 1060 &&
      newMarginLeft <= 1430 &&
      newMarginBottom < 300
    ) {
      document.getElementById('sector8arrow').style.visibility = 'visible'
    } else if (
      newMarginLeft > 1430 &&
      newMarginLeft <= 1800 &&
      newMarginBottom < 300
    ) {
      document.getElementById('sector9arrow').style.visibility = 'visible'
    }
  }

  const setLocation = (elementId, newMarginLeft, newMarginBottom) => {
    const locationDot = document.getElementById(elementId)

    locationDot.style.marginLeft = newMarginLeft + 'px'
    locationDot.style.marginBottom = newMarginBottom + 'px'

    //console.log(newMarginLeft, newMarginBottom)

    recordService.getAll().then((received) => {
      try {
        if (
          received.filter((element) => element.status === 'Confirmed').length >
            0 &&
          elementId === 'userLocationDot'
        ) {
          changeArrows(newMarginLeft, newMarginBottom)
        } else {
          locationDot.style.visibility = 'visible'
          hideArrowIcons()
        }
      } catch {
        console.log('Loading...')
      }
    })
  }

  const userDotLocation = () => {
    if (location.longitude !== '' && location.latitude !== '') {
      const measures = calculateLocation(location.latitude, location.longitude)
      setLocation('userLocationDot', measures.x3px, measures.y3px)
      setFirstAccess(false)
    } else {
      console.log('Undefined coordinates')
    }
  }

  const extraDotLocation = (userId) => {
    if (counter + 1 !== 6) {
      userService.getUser(userId).then((userReceived) => {
        try {
          evacuationStatusService
            .getStatus(userReceived.evacuationStatus)
            .then((evacuationStatusReceived) => {
              try {
                if (
                  evacuationStatusReceived.latitude !== '' &&
                  evacuationStatusReceived.latitude !== ''
                ) {
                  const measures = calculateLocation(
                    evacuationStatusReceived.latitude,
                    evacuationStatusReceived.longitude
                  )
                  const name = 'extraDot' + (counter + 1).toString()
                  setCounter(counter + 1)
                  setLocation(name, measures.x3px, measures.y3px)
                  document.getElementById(name + 'Label').innerHTML =
                    userReceived.username
                } else {
                  console.log('Undefined coordinates')
                }
              } catch {
                console.log('Loading...')
              }
            })
        } catch {
          console.log('Loading...')
        }
      })
    } else {
      alert('You can only show 5 users at once')
    }
  }

  const calculateLocation = (latitude, longitude) => {
    const x3 = -3.692377209663391 // Real: -3.6924083333333337    // 1A
    const y3 = 40.54694738737521 // Real: 40.5471944             // 1A
    const x2 = -3.6909019947052 // Real: -3.6908722222222226    // 9B
    const y2 = 40.547122783219365 // Real: 40.54715               // 9B
    const x1 = longitude
    const y1 = latitude
    const x0 = -3.692205548286438 // Real: -3.6921833333333334    // 3A
    const y0 = 40.54666214197055 // Real: 40.5466806             // 3A
    let alpha
    let beta
    let delta
    let gamma

    // Calculate distance between coordinates origin and current position
    const distance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))

    if (x1 - x0 < 0) {
      delta = Math.atan((y1 - y0) / -(x1 - x0))
      alpha = Math.PI - delta
      gamma = Math.atan((y3 - y0) / -(x3 - x0))
      beta = Math.PI / 2 - gamma
    } else {
      alpha = Math.atan((y1 - y0) / (x1 - x0))
      beta = Math.atan((y2 - y0) / (x2 - x0))
    }

    //console.log("Alpha: " + alpha)
    //console.log("Alpha: " + alpha*180/Math.PI)
    //console.log("Beta: " + beta)
    //console.log("Beta: " + beta*180/Math.PI)

    // Calculate angle between side of the building and current position
    const angle = alpha - beta

    // Calculate cathetus of the position in coordinates and translate into px
    const x4 = distance * Math.cos(angle)
    const xToPixels = Math.sqrt(Math.pow(x2 - x0, 2) + Math.pow(y2 - y0, 2)) // This is 1800px
    const x3px = (x4 * width) / xToPixels

    const y4 = distance * Math.sin(angle)
    const yToPixels = Math.sqrt(Math.pow(x3 - x0, 2) + Math.pow(y3 - y0, 2)) // This is 600px
    const y3px = (y4 * height) / yToPixels

    //console.log("x4 is " + x4)
    //console.log("y4 is " + y4)

    return { x3px, y3px }
  }

  const hideLocations = () => {
    let locationDot
    for (let i = 1; i < 6; i++) {
      let name = 'extraDot' + i.toString()
      locationDot = document.getElementById(name)
      locationDot.style.visibility = 'hidden'
    }
    setCounter(0)
    userDotLocation()
    refreshUserList()
  }

  const hideFireIcons = () => {
    for (let i = 1; i < 11; i++) {
      let name = 'fired' + i.toString()
      var fireIcon = document.getElementById(name)

      //console.log("A ver " + fireIcon)

      if (!fireIcon.style.left && !fireIcon.style.bottom) {
        fireIcon.style.visibility = 'hidden'
      } else {
        fireIcon.style.visibility = 'visible'
      }
    }
  }

  const hideArrowIcons = () => {
    for (let i = 1; i < 12; i++) {
      let name = 'sector' + i.toString() + 'arrow'
      var arrowIcon = document.getElementById(name)
      arrowIcon.style.visibility = 'hidden'
    }
  }

  const getClickPositionAux = (e) => {
    const newPos = clickPositionService.getClickPosition(e, 'container')
    newPos.width = ref.current.offsetWidth
    newPos.height = ref.current.offsetHeight
    //console.log(newPos)
    const element = document.getElementById(newPos.name)
    element.style.left = newPos.left
    element.style.top = newPos.top
    dict.push(newPos)
  }

  const editFireLocations = () => {
    MySwal.fire({
      title: '<strong>Please click where there is <u>fire</u></strong>',
      width: 1900,
      icon: 'info',
      html: (
        <div
          className="customContainer"
          id="container"
          onClick={(e) => getClickPositionAux(e)}
          onLoad={hideFireIcons}
        >
          <span className="fire" id="fired1">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired2">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired3">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired4">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired5">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired6">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired7">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired8">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired9">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
          <span className="fire" id="fired10">
            <img className="fireImg" src={fire} alt=""></img>
          </span>
        </div>
      ),
      showDenyButton: true,
      denyButtonText: 'Cancel',
      denyButtonColor: '#9e9e9e',
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#e62e2e'
    }).then((response) => {
      if (response.isConfirmed) {
        setNewLocations()
      }
    })
  }

  async function setNewLocations() {
    try {
      const all = await fireLocationService.getAll()
      for (const element of all) {
        await fireLocationService.remove(element.id)
      }
      for (const ele of dict) {
        await fireLocationService.create(ele)
      }
      socket.emit('send_reload_request')
      window.location.reload()
    } catch {
      console.log('Loading...')
    }
  }

  return (
    <>
      <div>
        <Notification message={errorMessage} type={'warning'} />
      </div>
      <div
        ref={ref}
        className="customContainer"
        id="container"
        onLoad={hideArrowIcons}
      >
        <span className="userLocationDot" id="userLocationDot">
          <img className="locationDotImg" src={locationDot} alt=""></img>
        </span>
        <span className="extraDot1" id="extraDot1">
          <label className="extraDotLabel" id="extraDot1Label"></label>
        </span>
        <span className="extraDot2" id="extraDot2">
          <label className="extraDotLabel" id="extraDot2Label"></label>
        </span>
        <span className="extraDot3" id="extraDot3">
          <label className="extraDotLabel" id="extraDot3Label"></label>
        </span>
        <span className="extraDot4" id="extraDot4">
          <label className="extraDotLabel" id="extraDot4Label"></label>
        </span>
        <span className="extraDot5" id="extraDot5">
          <label className="extraDotLabel" id="extraDot5Label"></label>
        </span>
        <span className="fire" id="fire1">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire2">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire3">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire4">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire5">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire6">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire7">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire8">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire9">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="fire" id="fire10">
          <img className="fireImg" src={fire} alt=""></img>
        </span>
        <span className="alarmButton" id="alarmButton">
          <img className="alarmButtonImg" src={button} alt=""></img>
        </span>
        <span className="alarmDetector" id="alarmDetector">
          <img className="alarmDetectorImg" src={detector} alt=""></img>
        </span>
        <span className="sector1arrow" id="sector1arrow">
          <img className="sector1arrowImg" src={sector1arrow} alt=""></img>
        </span>
        <span className="sector2arrow" id="sector2arrow">
          <img className="sector2arrowImg" src={sector7arrow} alt=""></img>
        </span>
        <span className="sector3arrow" id="sector3arrow">
          <img className="sector3arrowImg" src={sector3arrow} alt=""></img>
        </span>
        <span className="sector4arrow" id="sector4arrow">
          <img className="sector4arrowImg" src={sector9arrow} alt=""></img>
        </span>
        <span className="sector5arrow" id="sector5arrow">
          <img className="sector5arrowImg" src={sector521arrow} alt=""></img>
        </span>
        <span className="sector10arrow" id="sector10arrow">
          <img className="sector10arrowImg" src={sector522arrow} alt=""></img>
        </span>
        <span className="sector11arrow" id="sector11arrow">
          <img className="sector11arrowImg" src={sector51arrow} alt=""></img>
        </span>
        <span className="sector6arrow" id="sector6arrow">
          <img className="sector6arrowImg" src={sector1arrow} alt=""></img>
        </span>
        <span className="sector7arrow" id="sector7arrow">
          <img className="sector7arrowImg" src={sector7arrow} alt=""></img>
        </span>
        <span className="sector8arrow" id="sector8arrow">
          <img className="sector8arrowImg" src={sector3arrow} alt=""></img>
        </span>
        <span className="sector9arrow" id="sector9arrow">
          <img className="sector9arrowImg" src={sector9arrow} alt=""></img>
        </span>
      </div>

      {currentUser.user ? (
        currentUser.user.isAdmin ? (
          <>
            <p />
            <div className="d-grid gap-2">
              <Button
                size="lg"
                variant="outline-warning"
                onClick={editFireLocations}
              >
                Edit fire locations
              </Button>
            </div>
            <div>
              <p />
              <p />
              <h1>List of users</h1>
              <p />
              <Table striped bordered hover variant="dark" key={update}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name and Surname</th>
                    <th>Status</th>
                    <th>Change Status</th>
                    <th>Show Location</th>
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
                          <UserStatus
                            user={user}
                            callShow={() => {
                              extraDotLocation(user.id)
                            }}
                            callRefresh={refreshUserList}
                          />
                        </tr>
                      ))
                  ) : (
                    <></>
                  )}
                </tbody>
              </Table>
              <Button variant="outline-light" onClick={hideLocations}>
                <img
                  alt=""
                  src={refresh}
                  width="23"
                  height="23"
                  className="d-inline-block align-top"
                />
                Refresh
              </Button>
            </div>
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  )
}

export default Container
