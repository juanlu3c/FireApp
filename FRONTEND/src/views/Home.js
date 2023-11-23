import io from 'socket.io-client'
import { useRef, useEffect, useState } from 'react'
import location from '../services/location'
import fireLocationService from '../services/fireLocation'
import recordService from '../services/records'
import currentUser from '../services/currentUser'
import evacuationStatuservice from '../services/evacuationStatus'
import clickPositionService from '../services/clickPosition'
import ComponentNotification from '../components/Notification'
import '../components/Map/Container/styles.css'
import fire from '../assets/icons/fire.png'
import one from '../assets/icons/one.png'
import two from '../assets/icons/two.png'
import three from '../assets/icons/three.png'
import four from '../assets/icons/four.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const socket = io.connect(process.env.REACT_APP_HEROKU_LINK) //("http://localhost:3001")

const Home = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  var dict = []
  const ref = useRef(null) // Get dimensions of container

  useEffect(() => {
    if (!('Notification' in window)) {
      // Check if the browser supports notifications
      alert(
        'This browser does not support desktop notification. Please use a recent version of Desktop Google Chrome for full experience'
      )
    } else {
      Notification.requestPermission().then(function (result) {
        if (result === 'denied' || result === 'default') {
          setErrorMessage('Please, allow notification access in your browser')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        location.latitude = position.coords.latitude
        location.longitude = position.coords.longitude
      })
    }

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
    return () => {
      setErrorMessage()
    }
  }, [])

  const getClickPositionAux = (e) => {
    const newPos = clickPositionService.getClickPosition(e, 'home')
    newPos.width = ref.current.offsetWidth
    newPos.height = ref.current.offsetHeight
    //console.log(newPos)
    const element = document.getElementById(newPos.name)
    element.style.left = newPos.left
    element.style.top = newPos.top
    dict.push(newPos)
  }

  const hideIcons = () => {
    for (let i = 1; i < 11; i++) {
      let name = 'fire' + i.toString()
      var theThing = document.getElementById(name)

      if (!theThing.style.left && !theThing.style.bottom) {
        theThing.style.visibility = 'hidden'
      } else {
        theThing.style.visibility = 'visible'
      }
    }
  }

  const sendAlarmRequest = () => {
    recordService.getAll().then((array) => {
      try {
        if (
          array.filter((element) => element.status === 'Confirmed').length > 0
        ) {
          Swal.fire('Error', 'There is already an active alarm', 'error')
        } else {
          Swal.fire({
            title: 'Fire the alarm?',
            input: 'text',
            text: "Write 'confirm' in textbox to confirm",
            icon: 'warning',
            showDenyButton: true,
            denyButtonText: 'No',
            denyButtonColor: '#9e9e9e',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#e62e2e',
            preConfirm: (pwd) => {
              try {
                if (pwd.toUpperCase() !== 'CONFIRM') {
                  throw new Error('Error')
                }
              } catch (e) {
                Swal.showValidationMessage(`Request failed`)
              }
            }
          }).then((response) => {
            try {
              if (response.isConfirmed) {
                MySwal.fire({
                  title:
                    '<strong>Please click where there is <u>fire</u></strong>',
                  width: 1900,
                  icon: 'info',
                  html: (
                    <div
                      ref={ref}
                      className="customContainer"
                      id="container"
                      onClick={(e) => getClickPositionAux(e)}
                      onLoad={hideIcons}
                    >
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
                    </div>
                  ),
                  showDenyButton: true,
                  denyButtonText: 'Cancel',
                  denyButtonColor: '#9e9e9e',
                  confirmButtonText: 'Confirm',
                  confirmButtonColor: '#e62e2e'
                }).then((response) => {
                  try {
                    if (response.isConfirmed) {
                      dict.forEach((element) => {
                        fireLocationService.create(element)
                      })

                      let status
                      if (currentUser.user) {
                        status = currentUser.user.isAdmin
                          ? 'Confirmed'
                          : 'Pending'
                      }

                      const locationObject = {
                        location: location.latitude + ', ' + location.longitude,
                        status: status,
                        alarmButton: false,
                        alarmDetector: false
                      }
                      recordService.create(locationObject).then(() =>
                        socket.emit('send_alarm_request', {
                          status: status,
                          alarmButton: false,
                          alarmDetector: false
                        })
                      )
                      if (currentUser.user) {
                        if (currentUser.user.isAdmin) {
                          Swal.fire(
                            'Warning',
                            'The alarm has been activated',
                            'success'
                          )
                        } else {
                          Swal.fire(
                            'Warning',
                            "An alarm notice has been given, waiting for the administrator's response",
                            'success'
                          )
                        }
                      }

                      // Set every user's evacuation status to "Not evacuated"
                      evacuationStatuservice.setAllStatus('Not evacuated')
                    }
                  } catch {
                    console.log('Loading...')
                  }
                })
              }
            } catch {
              console.log('Loading...')
            }
          })
        }
      } catch {
        console.log('Loading...')
      }
    })
  }

  return (
    <>
      <div>
        <ComponentNotification message={errorMessage} type={'warning'} />
      </div>
      <div className="homeparentcontainer">
        <div className="">
          <div className="centercontent">
            <img className="homelogo" src={fire} alt=""></img>
            <h1 className="hometitle">FireApp</h1>
          </div>
          <div className="centercontent">
            <p className="homedescription">
              FireApp is designed to provide an easy and efficient way to raise
              an alarm in case of a fire emergency. With just one click on the
              big red button, it sends an alert to the designated authorities.
              The application is user-friendly and can be used by anyone,
              ensuring safety and prompt response in case of an emergency.
            </p>
          </div>
        </div>
        <div className="stepstitlebg">
          <p className="stepstitle">
            Have you seen a fire? Follow these steps:
          </p>
        </div>
        <div className="stepsbg">
          <div className="steps">
            <img className="step" src={one} alt=""></img>
            <p className="stepstext">
              Protect yourself, go to a safe place and alert people who may be
              imminently affected by the fire.
            </p>
          </div>
          <div className="steps">
            <img className="step" src={two} alt=""></img>
            <p className="stepstext">
              Click on the following button and follow the prompts.
            </p>
          </div>
          <div className="firebuttoncontainer">
            <button className="fireButton" onClick={sendAlarmRequest}>
              <label className="fireButtonLabel">Fire!</label>
            </button>
          </div>
          <div className="steps">
            <img className="step" src={three} alt=""></img>
            <p className="stepstext">
              Leave the building following the evacuation routes marked on the
              map.
            </p>
          </div>
          <div className="steps">
            <img className="step" src={four} alt=""></img>
            <p className="stepstext">
              Once you have left the building, press the green button to confirm
              the evacuation.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
