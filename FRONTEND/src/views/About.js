import detector from '../assets/icons/detector.png'
import button from '../assets/icons/button.png'
import fire from '../assets/icons/fire.png'
import refresh from '../assets/icons/refresh.png'
import locationDot from '../assets/icons/locationDot.png'
import nut from '../assets/icons/nut.png'
import eps from '../assets/logos/eps.png'
import uam from '../assets/logos/uam.png'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const About = () => {
  return (
    <>
      <Row className="justify-content-md-center" id="content">
        <Col lg="9">
          <h1>About</h1> <br />
          <div>
            <h2>Me</h2>
            <label className="text">
              My name is Juan Luis Sanz and I'm student of the Informatics
              Engineering Degree in Escuela Politécnica Superior in Universidad
              Autónoma de Madrid. This is my final degree project (TFG) based on
              a system of management and proper realisation of building
              evacuations in case of fire. The application has been developed in
              React + Node.js + Express.js + MongoDB. For more information, see
              the project report which explains in detail the development and
              the internal functioning of the application, or the <span />
              <a className="linkstyle" href="/help">
                help
              </a>
              <span /> section to use the application correctly.
            </label>
            <br />
            <div className='centercontent'>
            <a href="https://www.uam.es/ss/Satellite/EscuelaPolitecnica/es/home.htm">
              <img className="epslogo" src={eps} alt=""></img>
            </a>
            <a href="https://www.uam.es/uam/inicio">
              <img className="uamlogo" src={uam} alt=""></img>
            </a>
            </div>
            <br />
          </div>
          <div>
            <h2>Intellectual property and licensing</h2>
            <label className="text">
              This is project has been completely done for academic purposes, it
              won't be commercialized.
              <br />
              <br />
              The following icon has been taken from <span />
              <a className="linkstyle" rel="" href="https://icons8.com/">
                icons8.com
              </a>
              : <br /> <br />
              <img className="fireImgAbout" src={fire} alt=""></img>
              <a
                className="linkstyle"
                rel=""
                href="https://iconos8.es/icon/QV5JEtrTP6nH/fire"
              >
                “Fire Emoji”
              </a>
              <br /> <br />
              The following icons have been taken from <span />
              <a className="linkstyle" rel="" href="https://thenounproject.com">
                The Noun Project
              </a>
              : <br /> <br />
              <img className="refreshImgAbout" src={refresh} alt=""></img>
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/icon/refresh-854003/"
              >
                “Refresh”
              </a>
              <span /> by{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/aneeque/"
              >
                Aneeque Ahmed
              </a>{' '}
              <span />
              is licensed under{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://creativecommons.org/licenses/by/3.0/"
              >
                CC BY 3.0
              </a>
              . <br /> <br />
              <img
                className="locationDotImgAbout"
                src={locationDot}
                alt=""
              ></img>
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/icon/dot-circle-3089405/"
              >
                Dot Circle
              </a>
              <span /> by{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/imr03/"
              >
                Imr
              </a>{' '}
              <span />
              is licensed under{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://creativecommons.org/licenses/by/3.0/"
              >
                CC BY 3.0
              </a>
              . <br /> <br />
              <img className="nutImgAbout" src={nut} alt=""></img>
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/icon/nut-3049998/"
              >
                Nut
              </a>
              <span /> by{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/chintuza/"
              >
                Chintuza
              </a>{' '}
              <span />
              is licensed under{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://creativecommons.org/licenses/by/3.0/"
              >
                CC BY 3.0
              </a>
              . <br /> <br />
              <img
                className="alarmDetectorImgAbout"
                src={detector}
                alt=""
              ></img>
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/icon/smoke-detector-4158095/"
              >
                “Smoke detector”
              </a>
              <span /> by{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/Flowicon/"
              >
                Flowicon
              </a>{' '}
              <span />
              is licensed under{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://creativecommons.org/licenses/by/3.0/"
              >
                CC BY 3.0
              </a>
              . <br /> <br />
              <img className="alarmButtonImgAbout" src={button} alt=""></img>
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/icon/fire-button-5018261/"
              >
                “fire button”
              </a>
              <span /> by{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://thenounproject.com/redftbn/"
              >
                Andy Horvath
              </a>{' '}
              <span />
              is licensed under{' '}
              <a
                className="linkstyle"
                rel=""
                href="https://creativecommons.org/licenses/by/3.0/"
              >
                CC BY 3.0
              </a>
              . <br /> <br />
            </label>
          </div>
          <br />
          <br />
          <div>
            <a
              rel="license"
              href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
            >
              <img
                alt="Licencia de Creative Commons"
                src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
              />
            </a>
            <br />
            <label>
              This work and all its content is licensed under a <span />
              <a
                className="linkstyle"
                rel="license"
                href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
              >
                Creative Commons Attribution 4.0 International License
              </a>
              . All the application, designs (except the icons previously
              showed), code, functionality and architecture has been exclusively
              developed by me.
            </label>
            <br /> <br />
            <br />
          </div>
        </Col>
      </Row>
    </>
  )
}
export default About
