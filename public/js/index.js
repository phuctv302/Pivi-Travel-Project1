/* eslint-disable */
import '@babel/polyfill';
import { showAlert } from './alert';
import { login, logout, forgotPassword, resetPassword } from './login';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { updateSettings } from './updateSetting';

// GET ELEMENT
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const alertMessage = document.querySelector('body').dataset.alert;
const forgotPasswordForm = document.querySelector('.form--forgot-password');
const resetPasswordForm = document.querySelector('.form--reset-password');

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
