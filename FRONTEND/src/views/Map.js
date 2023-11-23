import Container from '../components/Map/Container/Container'
import userService from '../services/users'
import recordService from '../services/records'
import evacuationStatusService from '../services/evacuationStatus'
import { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const Map = () => {
  const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))

  const [showButton, setShowButton] = useState()
  const [status, setStatus] = useState()

  useEffect(() => {
    recordService.getAll().then((array) => {
      try {
        if (
          array.filter((element) => element.status === 'Confirmed').length > 0
        ) {
          // An alarm is active
          setShowButton(true)
        }
      } catch {
        console.log('Loading...')
      }
    })
  }, [])

  useEffect(() => {
    if (cookie) {
      userService.getUser(cookie.userId).then((userReceived) => {
        try {
          evacuationStatusService
            .getStatus(userReceived.evacuationStatus)
            .then((statusReceived) => {
              try {
                setStatus(statusReceived.status)
              } catch {
                console.log('Loading...')
              }
            })
        } catch {
          console.log('Loading...')
        }
      })
    }
  }, []) // eslint-disable-line

  const confirmEvacuation = () => {
    // Update evacuation status in users schema
    userService.getUser(cookie.userId).then((userReceived) => {
      try {
        const evacuationStatusObject = {
          latitude: userReceived.evacuationStatus.latitude,
          longitude: userReceived.evacuationStatus.longitude,
          status: 'Evacuated'
        }
        evacuationStatusService.update(
          userReceived.evacuationStatus,
          evacuationStatusObject
        )
        setStatus('Evacuated')
      } catch {
        console.log('Loading...')
      }
    })
  }

  return (
    <>
      {cookie ? (
        <>
          <Row className="justify-content-md-center" id="content">
            <Col lg="11">
              <div>
                <h1>Map</h1>
              </div>
              <Container />
              <div>
                {showButton ? (
                  <>
                    <p />
                    <h3>Your evacuation status: </h3>
                    {status === 'Evacuated' ? (
                      <label className="subtitlegreenlabel">{status}</label>
                    ) : (
                      <>
                        <label className="subtitleredlabel">{status}</label>
                        <p />
                        <h3>Click here to confirm evacuation: </h3>
                        <p />
                        <div className="d-grid gap-2">
                          <Button
                            size="lg"
                            variant="success"
                            id="confirmButton"
                            onClick={confirmEvacuation}
                          >
                            Confirm
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <div>
          <h2 className="notloggedin">Please log in</h2>
        </div>
      )}
    </>
  )
}

export default Map
