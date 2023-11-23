import { useEffect, useState } from 'react'
import evacuationStatusService from '../../services/evacuationStatus'

import Button from 'react-bootstrap/Button'

const UserStatus = (props) => {
  const [userEvacuationStatus, setuserEvacuationStatus] = useState()

  useEffect(() => {
    // We can access directly props.user.evacuationStatus.status but that will be the data passed as parameter, not the actual real-time status. Here we take it from database which is real-time
    evacuationStatusService
      .getStatus(props.user.evacuationStatus.id)
      .then((evacuationStatusReceived) => {
        try {
          if (userEvacuationStatus) {
            if (
              evacuationStatusReceived.status !== userEvacuationStatus.status
            ) {
              setuserEvacuationStatus(evacuationStatusReceived)
            }
          } else {
            setuserEvacuationStatus(evacuationStatusReceived)
          }
        } catch {
          console.log('Loading...')
        }
      })

    return () => {
      setuserEvacuationStatus()
    }
  }, []) // eslint-disable-line

  const changeUserStatus = () => {
    if (userEvacuationStatus) {
      const statusObject = userEvacuationStatus
      if (userEvacuationStatus.status === 'Evacuated') {
        statusObject.status = 'Not evacuated'
      } else {
        statusObject.status = 'Evacuated'
      }

      evacuationStatusService
        .update(userEvacuationStatus.id, statusObject)
        .then((answer) => {
          try {
            if (answer) props.callRefresh()
          } catch {
            console.log('Loading...')
          }
        }) // Wait for db to update before refreshing
    }
  }

  const showLocation = () => {
    const button = document.getElementById(props.user.id)
    button.disabled = true
    props.callShow()
  }

  return (
    <>
      <td>{props.user.username}</td>
      <td>
        {props.user.name} {props.user.surname}
      </td>

      {userEvacuationStatus ? (
        <>
          {userEvacuationStatus.status === 'Evacuated' ? (
            <>
              <td>
                <label className="greenlabel">
                  {userEvacuationStatus.status}
                </label>
              </td>
            </>
          ) : (
            <>
              {userEvacuationStatus.status === 'Not evacuated' ? (
                <>
                  <td>
                    <label className="redlabel">
                      {userEvacuationStatus.status}
                    </label>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <label className="greylabel">Not available</label>
                  </td>
                </>
              )}
            </>
          )}
          <td>
            <Button variant="outline-primary" onClick={changeUserStatus}>
              Change Status
            </Button>
          </td>
        </>
      ) : (
        <></>
      )}
      <td>
        <Button
          variant="outline-primary"
          id={props.user.id}
          onClick={showLocation}
        >
          Show Location
        </Button>
      </td>
    </>
  )
}

export default UserStatus
