import {Component} from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import Popup from 'reactjs-popup'
import {AiOutlineClose} from 'react-icons/ai'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

const userArray = [
  {
    username: 'aakash',
    password: 'sky@007',
    id: 1,
  },
  {
    username: 'agastya',
    password: 'myth#789',
    id: 2,
  },
  {
    username: 'advika',
    password: 'world@5',
    id: 3,
  },
  {
    username: 'binita',
    password: 'modest*6',
    id: 4,
  },
  {
    username: 'chetan',
    password: 'vigor$life',
    id: 5,
  },
  {
    username: 'deepak',
    password: 'lightstar@1',
    id: 6,
  },
  {
    username: 'harshad',
    password: 'joy@85',
    id: 7,
  },
  {
    username: 'kapil',
    password: 'moon$008',
    id: 8,
  },
  {
    username: 'rahul',
    password: 'rahul@2021',
    id: 9,
  },
  {
    username: 'shravya',
    password: 'musical#stone',
    id: 10,
  },
  {
    username: 'saira',
    password: 'princess@9',
    id: 11,
  },
]

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    errorUsername: false,
    errorPassword: false,
  }

  onBlurUsername = () => {
    const {username} = this.state
    if (username === '') {
      this.setState({errorUsername: true})
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value, errorUsername: false})
  }

  onBlurPassword = () => {
    const {password} = this.state
    if (password === '') {
      this.setState({errorPassword: true})
    }
  }

  onChangePassword = event => {
    this.setState({password: event.target.value, errorPassword: false})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password, errorPassword} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          onBlur={this.onBlurPassword}
          placeholder="Password"
        />
        {errorPassword && <p className="error-message">*required</p>}
      </>
    )
  }

  renderUsernameField = () => {
    const {username, errorUsername} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          onBlur={this.onBlurUsername}
          placeholder="Username"
        />
        {errorUsername && <p className="error-message">*required</p>}
      </>
    )
  }

  onCredentials = (name, pass) => {
    this.setState({username: name, password: pass})
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <img
          src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1686982061/OBJECTS_vhzs5o.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1688631998/logo_u0ypuv.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <p className="logo-text-desktop">Insta Share</p>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <div className="popup-container">
            <Popup
              modal
              trigger={
                <button type="button" className="trigger-button">
                  <p className="forgot">Forgot Password?</p>
                  <p className="show">Show Credentials</p>
                </button>
              }
              className="popup-content"
            >
              {close => (
                <div className="modal-container">
                  <button
                    className="close-button"
                    type="button"
                    onClick={() => close()}
                  >
                    <AiOutlineClose className="icon-close" />
                  </button>
                  <ul className="table-container">
                    <li className="head-row" key="head row">
                      <p className="head-row-text">Username</p>
                      <p className="head-row-text">Password</p>
                    </li>
                    {userArray.map(eachItem => (
                      <li
                        className="head-row"
                        key={eachItem.id}
                        onClick={() =>
                          this.onCredentials(
                            eachItem.username,
                            eachItem.password,
                          )
                        }
                      >
                        <p className="row-text">{eachItem.username}</p>
                        <p className="row-text">{eachItem.password}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Popup>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
