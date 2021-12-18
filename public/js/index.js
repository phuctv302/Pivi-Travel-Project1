/* eslint-disable */
import '@babel/polyfill';
import { showAlert } from './alert';
import { login, logout, forgotPassword, resetPassword, signup } from './auth';
import { displayMap } from './mapbox';
import { addReview } from './review';
import { bookTour } from './stripe';
import { updateSettings } from './updateSetting';

// GET ELEMENT
const mapBox = document.getElementById('map');

const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

const forgotPasswordForm = document.querySelector('.form--forgot-password');
const resetPasswordForm = document.querySelector('.form--reset-password');

const bookBtn = document.getElementById('book-tour');
const alertMessage = document.querySelector('body').dataset.alert;
const addReviewForm = document.querySelector('.form--review');

// DELEGATION
if (mapBox) {
  displayMap(JSON.parse(mapBox.dataset.locations));
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', () => {
    logout();
  });
}

if (updateDataForm) {
  updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-data').textContent = 'Updating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');

    document.querySelector('.btn--save-data').textContent = 'Save settings';
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    bookBtn.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (alertMessage) {
  showAlert('success', alertMessage, 12);
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = resetPasswordForm.dataset.token;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    resetPassword(password, passwordConfirm, token);
  });
}

if (addReviewForm) {
  addReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tourId = addReviewForm.dataset.tourId;
    const tourSlug = addReviewForm.dataset.tourSlug;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    addReview(review, rating, tourId, tourSlug);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });
}
