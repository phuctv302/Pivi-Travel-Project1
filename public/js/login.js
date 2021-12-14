/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Login successfully!', 3000);
      window.setTimeout(() => {
        location.assign('/');
      }, 2);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 3);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      location.assign('/');
    }
  } catch (err) {
    console.log('Error', err);
    showAlert('error', 'Error logging out! Please try again.', 3);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Please check your email!', 3);
    }
  } catch (err) {
    console.log('Error', err);
    showAlert('error', err.response.data.message, 3);
  }
};

export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Reset password successfully! Please remember your password.',
        4
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 3);
  }
};
