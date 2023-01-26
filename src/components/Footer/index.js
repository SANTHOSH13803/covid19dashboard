import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'
import './index.css'

export default function Footer() {
  return (
    <div className="footer">
      <h1 className="logo">
        COVID19<span>INDIA</span>
      </h1>
      <p>we stand with everyone fighting on the front lines</p>
      <div className="icons">
        <a target="_blank" href="#git">
          <VscGithubAlt />
        </a>
        <a target="_blank" href="#instagram">
          <FiInstagram />
        </a>
        <a target="_blank" href="#twitter">
          <FaTwitter />
        </a>
      </div>
    </div>
  )
}
