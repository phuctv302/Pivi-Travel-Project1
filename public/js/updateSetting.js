/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// type is either 'data' or 'password'
export const updateSettings = async (data, type) => {
  try {
    console.log(data);
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${type === 'data' ? 'updateMe' : 'updateMyPassword'}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Update ${type.toUpperCase()} successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
