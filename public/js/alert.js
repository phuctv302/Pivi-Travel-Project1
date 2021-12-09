/* eslint-disable */

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is either success or error
// time: time to hide the alert
export const showAlert = (type, msg, time) => {
  hideAlert();

  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, time);
};
