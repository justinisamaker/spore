import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import './Header.scss';
import { Button } from '../button/Button';
import { ReactComponent as Logo } from '../../images/sojourn-fare-logo.svg';

class Header extends Component{
  onLogoutClick(e){
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render(){
    const { isAuthenticated } = this.props.auth;

    const authLinks = (
      <ul>
        <li>
          <Link to='/' onClick={this.onLogoutClick.bind(this)}>
            <Button text='Log Out' color='light'/>
          </Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul>
        {/*
        <li>
          <Link to="/register"><Button text='Register' color='light'/></Link>
        </li>
        */}

        <li>
          <Link to="/login"><Button text='Login' color='light'/></Link>
        </li>
      </ul>
    );

    return(
      <header className="main-header">
        <Link to="/">
          <h1>Solar Mushroom Kit</h1>
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
