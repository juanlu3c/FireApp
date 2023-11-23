import userService from '../../services/users'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button'

const User = (props) => {
  const removeUser = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The user will be permanently deleted',
      icon: 'warning',
      showDenyButton: true,
      denyButtonText: 'No',
      denyButtonColor: '#9e9e9e',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#e62e2e'
    }).then((response) => {
      if (response.isConfirmed) {
        try {
          userService.remove(id).then(() => {
            props.callRefresh()
          })

        } catch {
          console.log('Loading...')
        }
      }
    })
  }

  return (
    <>
      <td>{props.user.username}</td>
      <td>
        {props.user.name} {props.user.surname}
      </td>
      <td>{props.user.position}</td>
      <td>{props.user.isAdmin ? <label>true</label> : <label>false</label>}</td>
      <td>
        <Button
          variant="outline-danger"
          onClick={() => {
            removeUser(props.user.id)
          }}
        >
          Delete
        </Button>
      </td>
      <td>
        <Button
          variant="outline-primary"
          href={`/admin/usermanager/edituser/${props.user.id}`}
        >
          Edit
        </Button>
      </td>
    </>
  )
}

export default User
