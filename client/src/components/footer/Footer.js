import React, { Component } from 'react';
import './Footer.scss';

class Footer extends Component{
  render(){
    return(
      <footer className="main-footer">
        <h6>&copy; 2019 Sojourn Fare&nbsp;&nbsp;&nbsp;||&nbsp;&nbsp;&nbsp;Problem with the app? E-mail us at <a href="mailto:techsupport@sojournfare.com">techsupport@sojournfare.com</a>.</h6>
      </footer>
    );
  }
}

export default Footer;
