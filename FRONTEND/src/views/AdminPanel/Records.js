import { useState, useEffect } from 'react'
import AdminMenu from './AdminMenu'
import recordService from '../../services/records'
import Record from '../../components/AdminPanel/Record'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Records = () => {
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

  const refreshRecordsList = () => {
    console.log("Hola")
    recordService.getAll().then((newRecords) => {
      try {
        setRecords(newRecords)
      } catch {
        console.log('Loading...')
      }
    })
  }

  return (
    <>
      <div>
        <p />
        <AdminMenu />
      </div>
      <Row className="justify-content-md-center" id="content">
        <Col lg="9">
          <div>
            <h1>Records</h1>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Date (mm/dd/yyyy)</th>
                  <th>Location of the call</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records
                  .slice(0)
                  .reverse()
                  .map((record, i) => (
                    <tr key={i}>
                      <Record 
                        record={record} 
                        callRefresh={refreshRecordsList}
                      />
                    </tr>
                  ))}
              </tbody>
            </Table>
            
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Records
