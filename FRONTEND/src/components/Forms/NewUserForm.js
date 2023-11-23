import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function NewUserForm(props) {
  return (
    <div>
      {
        <Form onSubmit={props.handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              defaultValue={props.username}
              name="Username"
              placeholder="Username"
              onChange={props.handleUsernameChange}
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              defaultValue={props.password}
              name="Password"
              placeholder="Password"
              onChange={props.handlePasswordChange}
            />
            <Form.Label>
              {' '}
              (Leave in blank for keeping actual password)
            </Form.Label>
          </Form.Group>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name and Surname:</Form.Label>
            <Form.Control
              type="text"
              defaultValue={props.name}
              name="Name"
              placeholder="Name"
              onChange={props.handleNameChange}
            />
          </Form.Group>
          <Form.Group controlId="surname" className="mb-3">
            <Form.Control
              type="text"
              defaultValue={props.surname}
              name="Surname"
              placeholder="Surname"
              onChange={props.handleSurnameChange}
            />
          </Form.Group>
          <Form.Group controlId="position" className="mb-3">
            <Form.Label>Position:</Form.Label>
            <Form.Control
              type="text"
              defaultValue={props.position}
              name="Position"
              placeholder="Position"
              onChange={props.handlePositionChange}
            />
          </Form.Group>
          <Form.Group controlId="isadmin" className="mb-3">
            <Form.Label>Is admin?</Form.Label>
            <Form.Check
              type="checkbox"
              defaultChecked={props.isAdmin}
              onChange={props.handleAdminChange}
            />
          </Form.Group>
          {props.type === 'New' ? (
            <Button variant="primary" type="submit">
              Sign up new user
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Submit
            </Button>
          )}
        </Form>
      }
    </div>
  )
}
