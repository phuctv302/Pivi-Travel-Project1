/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51JwyYkJ8FJNSI7ayLW0i2AeN1MCFPWcbnAmGrlYD4pXcAxNQhCv8cMoipLit6h6WWV4k9yImZmq9NyPqSEONLSXa00VUPxOQ2B'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err, 3);
  }
};
