import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import mapfirelocation from '../assets/images/mapfirelocation.png'
import firebutton from '../assets/images/firebutton.png'
import confirmation from '../assets/images/confirmation.png'
import usermap from '../assets/images/usermap.png'
import adminmap from '../assets/images/adminmap.png'
import active from '../assets/images/active.png'
import pending from '../assets/images/pending.png'
import records from '../assets/images/records.png'
import list from '../assets/images/list.png'
import form from '../assets/images/form.png'
import optionsicon from '../assets/images/optionsicon.png'
import optionslocation from '../assets/images/optionslocation.png'
import fixedlocation from '../assets/images/fixedlocation.png'
import privacy from '../assets/images/privacy.png'
import extension from '../assets/images/extension.png'

const Help = () => {
  return (
    <>
      <Row className="justify-content-md-center" id="content">
        <Col lg="9">
          <h1>Help</h1>
          <label className="text">
            This is a help section to explain the basic operation of the
            application. Everything explained here is well developed in the
            project report, this is just a general review. All sections of the
            application will be explained separately. <br />
            <br />
            If you are going to test the application, it is recommended to open
            a normal tab and an incognito tab within the same browser, and in
            one of them log in with a user and in the other one with an
            administrator, in order to see the parallelism between all connected
            devices and the real-time messages between devices and server.{' '}
            <br />
            <br />
            <b>
              It is highly recommended to use Google Chrome in its most recent
              version
            </b>{' '}
            to test the app, since other browsers like firefox or safari have
            some incompatibility problems with certain modules such as location,
            notifications and css style sheets.
            <br />
            For the same reason as above, it is also recommended to run it from
            localhost instead of the version uploaded to the www in Vercel.
          </label>
          <br /> <br />
          <h2>Roles</h2>
          <label className="text">
            There are two roles defined in the application, on the one hand the
            <b> users</b>, which would be the majority of the company's
            employees, who have limited functions. On the other hand, the{' '}
            <b>administrators</b>, who have many different features for the
            control and management in case of fire. The following sections will
            explain everything from both points of view.
            <br />
            In the project memory you can find the credentials of both a user
            and an administrator to see the differences between the two roles.
          </label>
          <br /> <br />
          <h2>Home</h2>
          <label className="text">
            The two roles simply have a giant button to press in case of fire.
            They will be asked to type a confirmation message to avoid mistaken
            presses. They will then be asked to put the location of the fire in
            the building by clicking up to 10 times on the map. When confirmed,
            normal users will simply generate a pending alarm notification,
            which will be sent to the administrators in their administration
            panel to confirm or deny the alarm. On the other hand, if the button
            has been pressed by an administrator, a confirmed alarm will be
            generated directly and all users will be redirected to the Map
            section to follow the evacuation instructions.
          </label>
          <br /> <br />
          <img className="helpimageshome" alt="" src={firebutton} />
          <img className="helpimageshome" alt="" src={confirmation} />
          <img className="helpimageshome" alt="" src={mapfirelocation} />
          <br /> <br />
          <h2>Map</h2>
          <label className="text">
            <b>Important: </b> This application is implemented with the real
            coordinates of the EPS. To enjoy the full experience, it is
            recommended to install the{' '}
            <a
              className="linkstyle"
              rel=""
              href="https://github.com/chatziko/location-guard"
            >
              Location Guard
            </a>{' '}
            browser plugin (available for{' '}
            <a
              className="linkstyle"
              rel=""
              href="https://chrome.google.com/webstore/detail/location-guard/cfohepagpmnodfdmjliccbbigdkfcgia"
            >
              chrome
            </a>
            ,{' '}
            <a
              className="linkstyle"
              rel=""
              href="https://addons.mozilla.org/en-US/firefox/addon/location-guard/"
            >
              firefox
            </a>{' '}
            and{' '}
            <a
              className="linkstyle"
              rel=""
              href="https://microsoftedge.microsoft.com/addons/detail/location-guard/hbgdpjpeeodeojjbeenfnpnldhahleoo"
            >
              edge
            </a>
            ) where we can fake the location of our browser and put it inside
            the EPS building.
            <br />
            <br />
            Instructions:
            <br />
            <ol>
              <li>
                Install the plugin on your browser by its store (links above).
              </li>
              <li>
                Go to the{' '}
                <a className="linkstyle" href="/map">
                  Map
                </a>{' '}
                page in this app and then find the Location Guard icon in the
                url section of your browser and click on the 'Options' submenu.
              </li>
              <img className="extensionimage" alt="" src={extension} /> -----
              {'>'}
              <img className="helpimagesmap" alt="" src={optionsicon} />
              <br />
              <br />
              <li>
                In the 'Default level' section, select 'Use fixed location'.
              </li>
              <img className="helpimagesmap" alt="" src={optionslocation} />
              <br />
              <br />
              <li>
                In the left menu go to the 'Privacy Levels' section and select
                'Low', and then, move the first bar all the way to the left (to
                get the best possible accuracy).
              </li>
              <img className="helpimagesmap" alt="" src={privacy} />
              <br />
              <br />
              <li>
                In the left menu go to the 'Fixed Location' section and in the
                search icon, search exactly: Escuela Politécnica Superior,
                Madrid, España. Then, zoom in several times with the + icon to
                the EPS building (image below) and click anywhere inside.
                <br />
                <img className="helpimagesmap" alt="" src={fixedlocation} />
                <br />
                Please, note that the map available on this website does not
                include the conference room (left side of the building) or the
                cafeteria (right side of the building), only the classroom area
                and the central hall.
              </li>
              <br />
              <li>
                You can now return to our application. Make sure that a pointer
                appears with your location at the same point you have marked in
                the plugin options. At any time you can go back to the plugin
                options and move the pointer to any point of the EPS you want
                and it will be updated in real time on the map.
              </li>
            </ol>
          </label>
          <br />
          <hr className="horizontalline"></hr>
          <label className="text">
            On the map, normal users will find the map of the building they are
            in, as well as their location within it. When an alarm sounds, they
            will be shown the evacuation routes and a new section will appear
            with a button to click once they have been evacuated from the
            building so that the administrators can know in real time if the
            user has been evacuated or not.
          </label>{' '}
          <br /> <br />
          <img className="helpimagesmap" alt="" src={usermap} />
          <br /> <br /> <br />
          <label className="text">
            The administrators will have the same functionality as the users,
            but they will also be able to see a list of users with their
            evacuation status in real time and with two buttons, one to show the
            location of the users on the map and another to change the
            evacuation status in case a user does not have their device on them.
            They will also find a button where, once the alarm is confirmed,
            they can edit the locations of the fire icons to show in a more
            precise way where it is located so that users are well informed.
          </label>
          <br /> <br />
          <img className="helpimagesmap" alt="" src={adminmap} />
          <br /> <br /> <br />
          <h2>User Panel / Admin Panel</h2>
          <label className="text">
            The user panel will only be available to normal users, it will
            contain information about their profile. In case of any mistake,
            they should communicate it to an administrator for its modification.
            <br /> <br />
            The administrator panel is a very complete panel where you can find
            several sections:
            <br />
            <br />
            <ul className="ulhelp">
              <li>
                The first of them is the alarms section, where there will be a
                section where the confirmed alarms will appear with their
                information and a button to expire them. There will also be
                another section with the alarms pending confirmation, which are
                the alarm warnings created by the users that are pending
                confirmation or denial by the administrator in charge, depending
                on the situation.
              </li>
              <br />
              <img className="helpimageshome" alt="" src={active} />
              <img className="helpimageshome" alt="" src={pending} />
              <br />
              <br />
              <li>
                The second one is the records section, where you can see all the
                alarm records history, its complete information, a button to
                delete the record and its current status:
                <ul className="ulhelpsublist">
                  <li>
                    <label className="greenListText">Confirmed</label>: The
                    alarm is currently sounding.
                  </li>
                  <li>
                    <label className="redListText">Denied</label>: The alarm was
                    proposed by a user and then denied by an administrator.
                  </li>
                  <li>
                    <label className="orangeListText">Expired</label>: The alarm
                    was confirmed and later manually cancelled.
                  </li>
                  <li>
                    <label className="blueListText">Pending</label>: The alarm
                    has been proposed by a user and is pending confirmation by
                    an administrator.
                  </li>
                </ul>
              </li>
              <br />
              <img className="helpimageshome" alt="" src={records} />
              <br />
              <br />
              <li>
                The last one is the users section, where you can see information
                of all the users of the system, edit it and also create new
                users and delete them.
              </li>
              <br />
              <img className="helpimageshome" alt="" src={list} /> <br />
              <br />
              <img className="helpimagesmap" alt="" src={form} />
            </ul>
          </label>
          <br /> <br />
        </Col>
      </Row>
    </>
  )
}

export default Help
