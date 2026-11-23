import {useState} from 'react'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

function Header(props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const {location} = props
  const {pathname} = location

  const onToggleMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState)
  }

  const onCloseMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const homeClass = pathname === '/' ? 'nav-link active-link' : 'nav-link'
  const aboutClass = pathname === '/about' ? 'nav-link active-link' : 'nav-link'

  return (
    <header className="header-container">
      <nav className="navbar">
        <Link to="/" className="logo-link" onClick={onCloseMenu}>
          <h1 className="logo-heading">
            COVID19<span className="logo-highlight">INDIA</span>
          </h1>
        </Link>

        <ul className="nav-menu-desktop">
          <li className="nav-item">
            <Link to="/" className={homeClass}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={aboutClass}>
              About
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMenu}
          aria-label="Toggle Menu"
        >
          <img
            src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1662435108/Covid19%20Dashboard/add-to-queue_1_t11111.png"
            alt="menu icon"
            className="menu-icon"
          />
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <ul className="nav-menu-mobile">
            <li className="nav-item">
              <Link to="/" className={homeClass} onClick={onCloseMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={aboutClass} onClick={onCloseMenu}>
                About
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="close-menu-btn"
            onClick={onCloseMenu}
          >
            ✕
          </button>
        </div>
      )}
    </header>
  )
}

export default withRouter(Header)
