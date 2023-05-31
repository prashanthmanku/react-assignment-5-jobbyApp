import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUserName = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onSubmitForm = async event => {
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
    console.log(data)
    console.log(response)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    }
    if (response.ok === false) {
      this.setState({errorMsg: data.error_msg, showSubmitError: true})
    }
  }

  render() {
    const {showSubmitError, errorMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-form-img"
            alt="website logo"
          />
          <div className="input-container">
            <label htmlFor="username" className="USERNAME">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="login-form-user-input-field"
              onChange={this.onChangeUserName}
              value={username}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="USERNAME">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="login-form-user-input-field"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          <button type="submit" className="login-form-btn">
            Login
          </button>
          {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
