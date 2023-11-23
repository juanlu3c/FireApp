import io from 'socket.io-client'
import recordService from '../../services/records'
import evacuationStatusService from '../../services/evacuationStatus'
import fireLocationService from '../../services/fireLocation'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'

const socket = io.connect(process.env.REACT_APP_HEROKU_LINK) //("http://localhost:3001")

const RecordConfirmed = ({ record }) => {
  const ExpireRecord = (record) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The alarm will become expired',
      icon: 'warning',
      showDenyButton: true,
      denyButtonText: 'No',
      denyButtonColor: '#9e9e9e',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#e62e2e'
    }).then((response) => {
      if (response.isConfirmed) {
        try {
          record.status = 'Expired'
          recordService.update(record.id, record)

          evacuationStatusService.setAllStatus(null)

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
        } catch {
          console.log('Loading...')
        }
      }
    })
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
          variant="outline-danger"
          onClick={() => {
            ExpireRecord(record)
          }}
        >
          Expire
        </Button>
      </td>
    </>
  )
}

export default RecordConfirmed
