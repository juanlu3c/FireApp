import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import nut from '../../assets/icons/nut.png'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const AdminMenu = () => {
  return (
    <>
      <Row className="justify-content-md-center" id="content">
        <Col lg="9">
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">
              <img
                alt=""
                src={nut}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Admin Menu
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="container-fluid">
                <Nav.Link className="navlinkspace" href="/admin/alarms">Alarms</Nav.Link>
                <Nav.Link className="navlinkspace" href="/admin/records">Records</Nav.Link>
                <Nav.Link className="navlinkspace" href="/admin/usermanager">User manager</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Col>
      </Row>
    </>
  )
}

export default AdminMenu
