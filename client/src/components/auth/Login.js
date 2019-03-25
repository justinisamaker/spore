import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import { Button } from '../button/Button';
import { ReactComponent as Logo } from '../../images/sojourn-fare-logo.svg';
import Modal from '../modal/Modal';

import './Login.scss';

class Login extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      errors: {},
      showModal: true
    };
  }

  openModalHandler = () => {
    this.setState({
      showModal: true
    });
  }

  closeModalHandler = () => {
    this.setState({
      showModal: false
    });
  }

  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.auth.isAuthenticated){
      this.props.history.push('/');
    }

    if(nextProps.errors){
      this.setState({ errors: nextProps.errors});
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  render(){
    const { errors } = this.state;

    return(
      <Modal className="modal" show={ this.state.showModal }  close={ this.closeModalHandler }>
        <div className="login-modal">
          <Logo className="login-logo"/>
          <form onSubmit={this.onSubmit} className="login-form">
            <TextFieldGroup
              placeholder="Username"
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.onChange}
              error={errors.email}
            />
            <TextFieldGroup
              placeholder="Password"
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              error={errors.password}
            />
          <Button text="Log in" color="medium" onSubmit={this.onSubmit} />
          </form>
        </div>
      </Modal>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
