import { useState, useEffect } from 'react'
import AdminMenu from './AdminMenu'
import RecordPending from '../../components/AdminPanel/RecordPending'
import RecordConfirmed from '../../components/AdminPanel/RecordConfirmed'
import recordService from '../../services/records'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Alarms = () => {
  const [records, setRecords] = useState([])

  useEffect(() => {
    recordService.getAll().then((initialRecords) => {
      try {
        setRecords(initialRecords)
      } catch {
        console.log('Loading...')
      }
    })

    return () => {
      setRecords()
    }
  }, [])

  return (
    <>
      <div>
        <p />
        <AdminMenu />
      </div>
      <Row className="justify-content-md-center" id="content">
        <Col lg="9">
          <div>
            <h1>Active alarms</h1>
            {records.filter((record) => record.status === 'Confirmed').length >
            0 ? (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Date</th>
                    <th>Location of the call</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records
                    .filter((record) => record.status === 'Confirmed')
                    .map((record, i) => (
                      <tr key={i}>
                        <RecordConfirmed record={record} />
                      </tr>
                    ))}
                </tbody>
              </Table>
            ) : (
              <label className="subtitlelabel">
                There are not active alarms at the moment
              </label>
            )}
            <p />
            <h1>Alarm requests pending confirmation</h1>
            {records.filter((record) => record.status === 'Pending').length >
            0 ? (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Date</th>
                    <th>Location of the call</th>
                    <th>Status</th>
                    <th>Confirm</th>
                    <th>Deny</th>
                  </tr>
                </thead>
                <tbody>
                  {records
                    .filter((record) => record.status === 'Pending')
                    .map((record, i) => (
                      <tr key={i}>
                        <RecordPending record={record} />
                      </tr>
                    ))}
                </tbody>
              </Table>
            ) : (
              <label className="subtitlelabel">
                There are not alarm requests at the moment
              </label>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Alarms
