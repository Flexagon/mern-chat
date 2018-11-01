import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import setAuthToken from './utils/setAuthToken';

import Auth from './components/auth/Auth';
import Chat from './components/chat/Chat';
import Login from './components/auth/Login';
import Register from './components/auth/Register';


export default class App extends Component {
  state = {
    isAuthentificated: false,
    user: {},
  }

  setCurrentUser = decoded => this.setState({ isAuthentificated: true, user: decoded })

  logoutCurrentUser = () => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    this.setState({ isAuthentificated: false, user: {} });
  }

  componentDidMount() {
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded = jwt_decode(localStorage.jwtToken);
      this.setCurrentUser(decoded);

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.logoutCurrentUser();
        window.location.href = '/login';
      }
    }
  }

  render() {
    const { isAuthentificated, user } = this.state;

    const MainPage = isAuthentificated ? <Chat userId={user.id} /> : <Auth />;

    return (
      <Router>
        <div className="App">
          <header className="Nav">
            <Link className="Nav-logo" to="/">MERN-chat</Link>
            { isAuthentificated ? (
              <ul className="Nav-list">
                <li><a className="Nav-link" onClick={this.logoutCurrentUser}>Logout</a></li>
              </ul>
            ) : (
              <ul className="Nav-list">
                <li><Link className="Nav-link" to="/register">Register</Link></li>
                <li><Link className="Nav-link" to="/login">Login</Link></li>
              </ul>
            )}
          </header>
          <div className="Container">
            <Route exact path="/" render={() => MainPage} />
            <Route exact path="/login" render={() => <Login setCurrentUser={this.setCurrentUser} />} />
            <Route exact path="/register" component={Register} />
          </div>
        </div>
      </Router>
    );
  }
}
