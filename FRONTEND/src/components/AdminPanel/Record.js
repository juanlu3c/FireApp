import recordService from '../../services/records'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'

const Record = (props) => {
  const removeRecord = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The record will be permanently deleted',
      icon: 'warning',
      showDenyButton: true,
      denyButtonText: 'No',
      denyButtonColor: '#9e9e9e',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#e62e2e'
    }).then((response) => {
      if (response.isConfirmed) {
        try {
          recordService.remove(id).then(() => {
            props.callRefresh()
          }
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
        {props.record.user
          ? props.record.user.username
          : props.record.alarmButton
          ? 'BUTTON'
          : props.record.alarmDetector
          ? 'DETECTOR'
          : ''}
      </td>
      <td>{props.record.date}</td>
      <td>{props.record.location}</td>
      <td>
        {props.record.status === 'Expired' ? (
          <label className="orangeText">{props.record.status}</label>
        ) : props.record.status === 'Denied' ? (
          <label className="redText">{props.record.status}</label>
        ) : props.record.status === 'Confirmed' ? (
          <label className="greenText">{props.record.status}</label>
        ) : (
          <label className="blueText">{props.record.status}</label>
        )}
      </td>
      <td>
        <Button
          variant="outline-danger"
          onClick={() => {
            removeRecord(props.record.id)
          }}
        >
          Remove
        </Button>
      </td>
    </>
  )
}

export default Record
