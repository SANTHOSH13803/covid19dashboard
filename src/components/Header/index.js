import './index.css'
import Popup from 'reactjs-popup'

import {CgMenuGridR} from 'react-icons/cg'
import {AiFillCloseCircle} from 'react-icons/ai'
import {Link} from 'react-router-dom'

export default function Header() {
  const linksContainer = () => (
    <ul className="menu-links">
      <li key="home">
        <Link to="/" className="link">
          Home
        </Link>
      </li>
      <li key="about">
        <Link to="/about" className="link">
          About
        </Link>
      </li>
    </ul>
  )

  return (
    <nav className="navbar">
      <Link to="/" className="link">
        <h1 className="logo">
          COVID19<span>INDIA</span>
        </h1>
      </Link>

      <Popup
        trigger={
          <button type="button" className="menu-btn">
            <CgMenuGridR size={25} />
          </button>
        }
        modal
        nested
      >
        {close => (
          <div className="small-menu">
            <div>
              {linksContainer()}
              <button type="button" className="close-btn" onClick={close}>
                <AiFillCloseCircle size={25} />
              </button>
            </div>
          </div>
        )}
      </Popup>
      <div className="large-menu">{linksContainer()}</div>
    </nav>
  )
}
