import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../../utils/setAuthToken';
import { API_USER_LOGIN } from '../../consts/APIRoutes';

class Login extends Component {
  static propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    history: PropTypes.instanceOf(Object).isRequired,
  }

  state = {
    email: '',
    password: '',
    errors: {},
  }

  onInputChange = e => this.setState({ [e.target.name]: e.target.value })

  onLoginSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    const user = { email, password };

    axios
      .post(API_USER_LOGIN, user)
      .then((res) => {
        const { token } = res.data;
        const decoded = jwt_decode(token);

        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        this.props.setCurrentUser(decoded);
        this.setState({ errors: {} });
        this.props.history.push('/');
      })
      .catch(err => this.setState({ errors: err.response.data }));
  }

  render() {
    const { email, password, errors } = this.state;
    const errorItems = Object.values(errors);

    return (
      <div className="Auth Auth-form">
        <h1 className="Auth-title">Log In</h1>
        <form onSubmit={this.onLoginSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.onInputChange}
            required
            className="Auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.onInputChange}
            required
            className="Auth-input"
          />
          <input
            type="submit"
            name="submit"
            value="Submit"
            className="Auth-button"
          />
        </form>
        {errorItems.length > 0 && (
          <ul className="Auth-errors">
            {errorItems.map(err => <li className="Auth-error" key={err}>{err}</li>)}
          </ul>
        )}
      </div>
    );
  }
}

export default withRouter(Login);
