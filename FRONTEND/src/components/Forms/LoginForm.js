import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function LoginForm(props) {
  const cookie = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))

  return (
    <div>
      {!cookie ? (
        <Form onSubmit={props.handleSubmit}>
          <Form.Group id="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={props.username}
              name="Username"
              placeholder="Username"
              onChange={props.handleUsernameChange}
            />
          </Form.Group>
          <Form.Group id="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={props.password}
              name="Password"
              placeholder="Password"
              onChange={props.handlePasswordChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        <h2>Logged in, redirecting...</h2>
      )}
    </div>
  )
}
