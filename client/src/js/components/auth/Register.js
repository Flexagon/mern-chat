import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { API_USER_REGISTER } from '../../consts/APIRoutes';

class Register extends Component {
  static propTypes = {
    history: PropTypes.instanceOf(Object).isRequired,
  }

  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
  }

  onInputChange = e => this.setState({ [e.target.name]: e.target.value })

  onRegisterSubmit = (e) => {
    e.preventDefault();
    const {
      name, email, password, password2,
    } = this.state;
    const { history } = this.props;

    const newUser = {
      name,
      email,
      password,
      password2,
    };

    axios
      .post(API_USER_REGISTER, newUser)
      .then(() => history.push('/login'))
      .catch(err => this.setState({ errors: err.response.data }));
  }

  render() {
    const {
      name, email, password, password2, errors,
    } = this.state;

    const errorItems = Object.values(errors);

    return (
      <div className="Auth Auth-form">
        <h1 className="Auth-title">Sign Up</h1>
        <form onSubmit={this.onRegisterSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={this.onInputChange}
            required
            className="Auth-input"
          />
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
            type="password"
            name="password2"
            placeholder="Confirm password"
            value={password2}
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

export default withRouter(Register);
