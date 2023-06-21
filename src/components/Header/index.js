import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome, AiOutlineClose} from 'react-icons/ai'
import {CgProfile} from 'react-icons/cg'
import {FaSearch} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import SearchContext from '../../Context/SearchContext'

import './index.css'

const Header = props => {
  const {history} = props
  const {location} = history
  const activeHome = location.pathname === '/' ? 'active-class' : 'nav-item'
  const activeHomeIcon =
    location.pathname === '/' ? 'icon-header-active' : 'icon-header'
  const activeProfile =
    location.pathname === '/my-profile' ? 'active-class' : 'nav-item'
  const activeProfileIcon =
    location.pathname === '/my-profile' ? 'icon-header-active' : 'icon-header'
  return (
    <SearchContext.Consumer>
      {value => {
        const {
          showInput,
          searchInput,
          onHideInput,
          onShowInput,
          onInputChange,
          onSearchEnter,
          changeStatusSearchComponent,
        } = value
        const display = () => {
          onShowInput()
        }
        const noDisplay = () => {
          onHideInput()
        }
        const logoutBtn = () => {
          Cookies.remove('jwt_token')
          history.replace('/login')
        }
        const searchChange = event => {
          onInputChange(event.target.value)
        }
        const searchEnter = event => {
          if (event.key === 'Enter') {
            onSearchEnter()
          }
        }
        const searchClicked = () => {
          onSearchEnter()
        }
        const changeRouteOrNot = () => {
          changeStatusSearchComponent()
        }
        return (
          <div className="header-border">
            <nav className="header-container">
              <div className="logo-container">
                <Link to="/" className="link-item">
                  <img
                    className="logo-image-header"
                    alt="website logo"
                    src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1686982081/Standard_Collection_8_xq2xkd.png"
                  />
                </Link>
                <p className="logo-text-header">Insta Share</p>
              </div>
              <div className="nav-menu">
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="search caption"
                    className="input-search"
                    value={searchInput}
                    onChange={searchChange}
                    onKeyDown={searchEnter}
                  />
                  <button
                    className="icon-container"
                    type="button"
                    // eslint-disable-next-line react/no-unknown-property
                    testid="searchIcon"
                    onClick={searchClicked}
                  >
                    <FaSearch className="search-icon" />
                  </button>
                </div>
                <Link to="/" className="link-item" onClick={changeRouteOrNot}>
                  <p className={activeHome}>Home</p>
                </Link>
                <Link
                  to="/my-profile"
                  className="link-item"
                  onClick={changeRouteOrNot}
                >
                  <p className={activeProfile}>Profile</p>
                </Link>
                <button
                  className="logout-button"
                  type="button"
                  onClick={logoutBtn}
                >
                  Logout
                </button>
              </div>
              <div className="nav-menu-mobile">
                <FaSearch className="icon-header" onClick={display} />
                <Link to="/" className="link-item">
                  <AiFillHome className={activeHomeIcon} />
                </Link>
                <Link to="/my-profile" className="link-item">
                  <CgProfile className={activeProfileIcon} />
                </Link>
                <button
                  type="button"
                  className="logout-icon"
                  onClick={logoutBtn}
                >
                  <FiLogOut className="icon-header" />
                </button>
              </div>
            </nav>
            {showInput && (
              <div className="close-container">
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="search caption"
                    className="input-search"
                    value={searchInput}
                    onChange={searchChange}
                    onKeyDown={searchEnter}
                  />
                  <button
                    className="icon-container"
                    type="button"
                    data-testid="searchIcon"
                    onClick={searchClicked}
                  >
                    <FaSearch className="search-icon" />
                  </button>
                </div>
                <AiOutlineClose className="icon-close" onClick={noDisplay} />
              </div>
            )}
          </div>
        )
      }}
    </SearchContext.Consumer>
  )
}

export default withRouter(Header)
