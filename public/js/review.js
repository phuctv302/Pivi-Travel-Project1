/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const addReview = async (review, rating, tourId, tourSlug) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Thanks for your reviewing!', 3);
      window.setTimeout(() => location.assign(`/tour/${tourSlug}`), 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 3);
  }
};
