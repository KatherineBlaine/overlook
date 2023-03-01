// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

import fetchAllData from '../api-calls';
import User from '../classes/user-class';
import Booking from '../classes/bookings-class';
import Room from '../classes/rooms-class';

let user, bookings, rooms;
let view = 'main';
const navButton = document.getElementById('nav-button');
const mainPage = document.getElementById('main-page');
const userDashboard = document.getElementById('user-dashboard');
const userGreeting = document.getElementById('user-greeting')

window.addEventListener('load', () => {
  fetchAllData()
    .then(data => {
      const userData = data[0].customers;
      const roomData = data[1].rooms;
      const bookingData = data[2].bookings;
      user = new User(userData[0])
      bookings = bookingData.map(booking => new Booking(booking))
      rooms = roomData.map(room => new Room(room))
    })
})

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