import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import { Provider } from 'react-redux';
import store from './store';

import Header from './components/header/Header';
import SystemOverview from './components/systemoverview/SystemOverview';
import Login from './components/auth/Login';
import CurrentReadingsContainer from './components/currentreadings/CurrentReadingsContainer';
import LineChart from './components/linechart/LineChart';
import Footer from './components/footer/Footer';

import './App.scss';

// check for jwtToken
if(localStorage.jwtToken){
  // Set the auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode the jwtToken and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime){
    // logout user
    store.dispatch(logoutUser());
    // clear current profile
    store.dispatch(clearCurrentProfile());
    // redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <div className="App">
            <Header />
            {/* <SystemOverview /> */}
            <Route exact path="/login" component={ Login } />
            <CurrentReadingsContainer />
            <LineChart />
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
