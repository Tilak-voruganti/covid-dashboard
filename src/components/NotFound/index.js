import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <Header />
    <div className="not-found-body">
      <img
        src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/Group_7484_notfound_v2w9x1.png"
        alt="not-found-pic"
        className="not-found-img"
      />
      <h1 className="not-found-heading">PAGE NOT FOUND</h1>
      <p className="not-found-description">
        we are sorry, the page you requested could not be found
      </p>
      <Link to="/">
        <button type="button" className="not-found-home-btn">
          Home
        </button>
      </Link>
    </div>
  </div>
)

export default NotFound
