// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

let view = 'main';
const navButton = document.getElementById('nav-button');
const mainPage = document.getElementById('main-page');
const userDashboard = document.getElementById('user-dashboard');

navButton.addEventListener('click', () => {
  if (view === 'main') {
    hide(mainPage)
    show(userDashboard)
    view = 'dashboard'
  } else {
    show(mainPage)
    hide(userDashboard)
    view = 'main'
  }
})

const hide = (element) => element.classList.add('hidden')
const show = (element) => element.classList.remove('hidden')