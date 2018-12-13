import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import './Header.scss';
import { Button } from '../button/Button';

class Header extends Component{
  onLogoutClick(e){
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render(){
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul>
        <li>
          <Link to='/' onClick={this.onLogoutClick.bind(this)}>
            <Button text='Log Out' />
          </Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul>
        <li>
          <Link to="/register"><Button text='Register' /></Link>
        </li>

        <li>
          <Link to="/login"><Button text='Login' /></Link>
        </li>
      </ul>
    );

    return(
      <header className="main-header">
        <Link to="/">
          <img src="/assets/images/sojourn-fare-logo.svg" alt="Sojourn Fare Logo" className="sojourn-fare-logo"/>
        </Link>

        <nav className="header-nav">
          { isAuthenticated ? authLinks : guestLinks }
        </nav>
      </header>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(Header);
