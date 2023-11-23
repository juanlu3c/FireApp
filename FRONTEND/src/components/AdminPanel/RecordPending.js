import io from 'socket.io-client'
import recordService from '../../services/records'
import fireLocationService from '../../services/fireLocation'
import { useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'

const socket = io.connect(process.env.REACT_APP_HEROKU_LINK) //("http://localhost:3001")

const RecordPending = ({ record }) => {
  // Hiding confirm and deny buttons if an alarm is already active (only one at a time)
  useEffect(() => {
    const confirmButton = document.getElementById('confirmButton')
    const denyButton = document.getElementById('denyButon')

    recordService.getAll().then((array) => {
      try {
        if (
          array.filter((element) => element.status === 'Confirmed').length > 0
        ) {
          confirmButton.style.visibility = 'hidden'
          denyButton.style.visibility = 'hidden'
        } else {
          confirmButton.style.visibility = 'visible'
          denyButton.style.visibility = 'visible'
        }
      } catch {
        console.log('Loading...')
      }
    })
  }, [])

  const ConfirmRecord = (record) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The alarm will be confirmed',
      icon: 'warning',
      showDenyButton: true,
      denyButtonText: 'No',
      denyButtonColor: '#9e9e9e',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#e62e2e'
    }).then((response) => {
      if (response.isConfirmed) {
        record.status = 'Confirmed'
        sendRecord(record)
      }
    })
  }

  const DenyRecord = (record) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The alarm will be denied',
      icon: 'warning',
      showDenyButton: true,
      denyButtonText: 'No',
      denyButtonColor: '#9e9e9e',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#e62e2e'
    }).then((response) => {
      if (response.isConfirmed) {
        try {
          fireLocationService
            .getAll()
            .then((received) => {
              try {
                received.forEach((element) => {
                  fireLocationService.remove(element.id)
                })
              } catch {
                console.log('Loading...')
              }
            })
            .then(
              socket.emit('send_alarm_request', {
                status: record.status
              })
            )

          record.status = 'Denied'
          sendRecord(record)
        } catch {
          console.log('Loading...')
        }
      }
    })
  }

  const sendRecord = (record) => {
    try {
      recordService.update(record.id, record)
      socket.emit('send_alarm_request', {
        status: record.status
      })
    } catch {
      console.log('Loading...')
    }
  }

  return (
    <>
      <td>
        {record.user
          ? record.user.username
          : record.alarmButton
          ? 'BUTTON'
          : record.alarmDetector
          ? 'DETECTOR'
          : ''}
      </td>
      <td>{record.date}</td>
      <td>{record.location}</td>
      <td>{record.status}</td>
      <td>
        <Button
          id="confirmButton"
          variant="outline-success"
          onClick={() => {
            ConfirmRecord(record)
          }}
        >
          Confirm
        </Button>
      </td>
      <td>
        <Button
          id="denyButton"
          variant="outline-danger"
          onClick={() => {
            DenyRecord(record)
          }}
        >
          Deny
        </Button>
      </td>
    </>
  )
}

export default RecordPending
