// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

// import 'js-datepicker/src/datepicker';
import fetchAllData from '../api-calls';
import User from '../classes/user-class';
import Booking from '../classes/bookings-class';
import Room from '../classes/rooms-class';
import Datepicker from 'Datepicker.js/src';


let user, bookings, rooms;
let view = 'main';
const navButton = document.getElementById('nav-button');
const mainPage = document.getElementById('main-page');
const userDashboard = document.getElementById('user-dashboard');
const userGreeting = document.getElementById('user-greeting');
const allRoomCards = document.getElementById('all-room-cards');
const userBookings = document.getElementById('user-bookings')
const userPayments = document.getElementById('user-payments');
const dashboardHeading = document.getElementById('dashboard-username');
const navBar = document.getElementById('navigate-rooms')
const datepicker = new Datepicker('#datepicker');
// const datepicker = new Datepicker('#datepicker');
// console.log(datepicker)




// console.log(picker)

window.addEventListener('load', () => {
  fetchAllData()
    .then(data => {
      const userData = data[0].customers;
      const roomData = data[1].rooms;
      const bookingData = data[2].bookings;
      user = new User(userData[0])
      bookings = bookingData.map(booking => new Booking(booking))
      rooms = roomData.map(room => new Room(room))
      populatePage();
    })
})

const populatePage = () => {
  userGreeting.innerText += `Hello, ${user.name}`

  rooms.forEach(room => {
    allRoomCards.innerHTML += `
    <figure class="room-card">
        <h3>${room.roomType}</h3>
        <p>Room #${room.number}</p>
        <p>Beds: ${room.numBeds}</p>
        <p>Price: $${room.costPerNight}</p>
      </figcaption>
    </figure>
    `
  })
  const userBookingList = bookings.filter(booking => booking.userID === user.id)

  userBookingList.forEach(userBooking => {
    userBookings.innerHTML += `
    <p>You have room ${userBooking.roomNumber} booked for ${userBooking.date}
    `
  })

  const totalUserPayments = userBookingList.reduce((accumulator, currentBooking) => {
    rooms.forEach(room => {
      if (currentBooking.roomNumber === room.number) {
        accumulator += room.costPerNight
      }
    })
    return accumulator;
  }, 0)

  userPayments.innerHTML += `
  <p>You have spent $${Math.round(totalUserPayments)}</p>
  `
  dashboardHeading.innerText = user.name;
  
  

}

navButton.addEventListener('click', () => {
  if (view === 'main') {
    hide(mainPage)
    show(userDashboard)
    view = 'dashboard'
    navButton.innerText = 'Home'
  } else {
    show(mainPage)
    hide(userDashboard)
    view = 'main'
    navButton.innerText = 'My Bookings'
  }
})

const hide = (element) => element.classList.add('hidden')
const show = (element) => element.classList.remove('hidden')