import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import 'Navbar.scss';

class Navbar extends Component{
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
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/" onClick={this.onLogoutClick.bind(this)}>Log Out</Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul>
        <li>
          <Link to="/register">Sign Up</Link>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    );

    return(
      <nav className="navbar">
        { isAuthenticated ? authLinks : guestLinks }
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(Navbar);
