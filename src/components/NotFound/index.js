import './index.css'
import {Link} from 'react-router-dom'

const NotFound = () => (
  <div className="not-found">
    <img
      src="https://res.cloudinary.com/dchd92xe9/image/upload/v1674317984/Corona%20Dashboard/Not%20found/Group_7484not-found_rvkad9.png"
      alt="not found"
    />
    <section>
      <h1>PAGE NOT FOUND</h1>
      <p>
        we’re sorry, the page you requested could not be found Please go back to
        the homepage
      </p>
    </section>
    <Link to="/" className="link">
      <button type="button">Home</button>
    </Link>
  </div>
)

export default NotFound
