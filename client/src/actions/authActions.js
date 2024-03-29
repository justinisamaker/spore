import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios.post('/users/login', userData)
    .then(res => {
      // save to localstorage
      const { token } = res.data;
      // set token to ls
      localStorage.setItem('jwtToken', token);
      // set token to auth header
      setAuthToken(token);
      // decode token to get user data
      const decoded = jwt_decode(token);
      // set the current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
};

// log user out
export const logoutUser = () => dispatch => {
  // remove token from localstorage
  localStorage.removeItem('jwtToken');
  // remove auth header
  setAuthToken(false);
  // set current user to empty obj which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
