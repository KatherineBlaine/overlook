import './css/styles.css';
import './images/turing-logo.png'
import {fetchAllData, postNewBooking} from '../api-calls';
import User from '../classes/user-class';
import Booking from '../classes/booking-class';
import Room from '../classes/rooms-class';
import dayjs from 'dayjs';
import './images/hotel-room.png';
import './images/overlook-hotel.png';
import RoomRepository from '../classes/room-repository-class';

let view = 'home';
let user, bookings, roomRepository, selectedDateData, selectedDateDOM, currentRooms, roomCards, selectedRoom;
const currentDate = '2022/01/01';

const myBookingsButton = document.getElementById('my-bookings');
const seeRoomsButton = document.getElementById('stay-with-us');
const homeButton = document.getElementById('home');

const mainPage = document.getElementById('main-page');
const userDashboard = document.getElementById('user-dashboard');
const userGreeting = document.getElementById('user-greeting');
const allRoomCards = document.getElementById('all-room-cards');
const upcomingBookings = document.getElementById('upcoming-bookings');
const pastBookings = document.getElementById('past-bookings');
const userPayments = document.getElementById('user-payments');
const dashboardHeading = document.getElementById('dashboard-username');
const navBar = document.getElementById('navigate-rooms');
const datepicker = document.getElementById('datepicker');
const roomTypeDropdown = document.getElementById('room-type-dropdown');
const footer = document.getElementById('footer');
const bookRoomButton = document.getElementById('book-room-button');
const bookingPage = document.getElementById('booking-page');
const confirmationPage = document.getElementById('confirmation-page');


const homeImage = document.getElementById('main-image');

window.addEventListener('load', () => {
  fetchAllData()
    .then(data => {
      const userData = data[0].customers;
      const roomData = data[1].rooms;
      const bookingData = data[2].bookings;
      bookings = bookingData.map(booking => new Booking(booking));
      // bookings = new BookingsRepository(bookingData, Booking);
      roomRepository = new RoomRepository(roomData);
      user = new User(userData[0], bookings, roomRepository.rooms, currentDate);
      currentRooms = roomRepository.rooms;
      populateMainPage(currentRooms);
      populateRoomTypeDropdown(currentRooms);
      populateUserDashboard();
    })
})

bookRoomButton.addEventListener('click', () => {
  populateBookingPage();
})

roomTypeDropdown.addEventListener('change', () => {
  filterRoomsByType();
})

datepicker.addEventListener('change', () => {
  pickDate();
  filterAllRoomsByDate();
})

const pickDate = () => {
  if (roomTypeDropdown.value !== 'select-value') {
    roomTypeDropdown.value = 'select-value';
  }
  selectedDateData = dayjs(datepicker.value).format('YYYY/MM/DD');
  selectedDateDOM = dayjs(datepicker.value).format('MM/DD/YYYY');
}

const filterAllRoomsByDate = () => {
  currentRooms = roomRepository.filterByDate(selectedDateData, bookings);
  // console.log(selectedDateData)
  console.log(currentRooms)

  resetPage();
  populateMainPage(currentRooms);
}

const filterRoomsByType = () => {
  if (roomTypeDropdown.value !== 'select-value') {
    let filteredRooms = roomRepository.filterByRoomType(roomTypeDropdown.value)
    resetPage();
    populateMainPage(filteredRooms);
  } else {
    resetPage();
    populateMainPage(currentRooms);
  }
}

seeRoomsButton.addEventListener('click', () => {
  if(view === 'home') {
    hide(homeImage);
  } else if (view === 'dashboard') {
    hide(userDashboard);
  }
  show(mainPage);
  show(homeButton);
  show(myBookingsButton);
  hide(seeRoomsButton);
  view = 'main';
})
const refreshUserBookings = () => {
  postNewBooking(user.id, selectedDateData, selectedRoom.number)
    .then(() => {
      fetchAllData()
        .then(data => {
          const bookingData = data[2].bookings;
          bookings = bookingData.map(booking => new Booking(booking));
          populateUserDashboard();
        })
    })
}

myBookingsButton.addEventListener('click', () => {
  if (view === 'home') {
    hide(homeImage)
  } else if (view === 'main') {
    hide(mainPage);
  }
  show(userDashboard);
  hide(myBookingsButton);
  hide(footer);
  show(homeButton);
  show(seeRoomsButton);
  view = 'dashboard';
})

homeButton.addEventListener('click', () => {
  if (view === 'main') {
    hide(mainPage);
    show(seeRoomsButton)
  } else if (view === 'dashboard') {
    hide(userDashboard);
    show(myBookingsButton)
  }
  show(homeImage)
  hide(homeButton)
  view = 'home'
})

const populateBookingPage = () => {
    bookingPage.innerHTML = `
    <h1>Book Room ${selectedRoom.number} at Overlook Hotel for ${selectedDateDOM}</h1>
    <h2>${selectedRoom.roomType}</h2>
    <h3>${selectedRoom.numBeds}${selectedRoom.bedSize}</h3>
    <h4>${selectedRoom.costPerNight} per night</h4>
    <button id="confirm-booking">Confirm Booking</button>
    `
    let confirmBookingButton = document.getElementById('confirm-booking');
  
    confirmBookingButton.addEventListener('click', () => {
      refreshUserBookings();
      populateConfirmationPage();
    })
  
    view = 'booking';
    hide(mainPage);
    hide(footer);
    show(bookingPage);
  }

const populateConfirmationPage = () => {
  confirmationPage.innerHTML = `
  <h1>BOOKING CONFIRMATION</h1>
  <h2>You have booked the ${selectedRoom.roomType} at the Outlook Hotel! We look forward to seeing you on ${selectedDateDOM}</h2>
  `
  hide(bookingPage);
  show(confirmationPage);
  view = 'confirmation';
  navButton.innerText = 'Home';
}


// DOM
const resetPage = () => {
  userGreeting.innerText = '';
  allRoomCards.innerHTML = '';
}

const populateRoomTypeDropdown = (currentRooms) => {
  const availableRoomTypes = [...new Set(currentRooms.map(room => room.roomType))];

  availableRoomTypes.forEach(roomType => {
    roomTypeDropdown.innerHTML += `
    <option value="${roomType}">${roomType}</option>
    `;
  })
}

const populateMainPage = (roomsToDisplay) => {
  userGreeting.innerText += `Hello, ${user.name}`;

  homeImage.innerHTML = '<img class="main-image" src="./images/overlook-hotel.png">'
  
  roomsToDisplay.forEach(room => {
    allRoomCards.innerHTML += `
    <figure class="room-card card-data" id="${room.number}">
      <img src="./images/hotel-room.png" alt="room img">
        <h2 class="card-data">${room.roomType}</h2>
        <h3 class="card-data">${room.numBeds} ${room.bedSize} bed</h3>
        <p class="card-data">$${room.costPerNight} per night</p>
      </figcaption>
    </figure>
    `;
  })

  roomCards = document.querySelectorAll('.room-card');

  roomCards.forEach(roomCard => {
    roomCard.addEventListener('click', (event) => {
      let selectedRoomNum
      resetSelected();
      if (event.target.className === 'card-data') {
        event.target.parentNode.classList.add('selected-room-card')
        selectedRoomNum = event.target.parentNode.id;
      } else if(event.target.className.includes('card-data')) {
        event.target.classList.add('selected-room-card')
        selectedRoomNum = event.target.id;
      }
      selectedRoom = roomRepository.find(room => selectedRoomNum === room.number.toString())
      show(footer)
    })
  })
}

const resetSelected = () => {
  roomCards.forEach(card => {
    if (card.className.includes('selected-room-card')) {
      card.classList.remove('selected-room-card')
    }
  })
}

const populateUserDashboard = () => {
  userPayments.innerHTML = '';
  dashboardHeading.innerText = '';
  pastBookings.innerHTML = '';
  upcomingBookings.innerHTML = '';
  const userBookingList = user.userBookings;

  userBookingList.forEach(userBooking => {
    roomCards.forEach(roomCard => {
      if (userBooking.roomNumber.toString() === roomCard.id && dayjs(userBooking.date).isBefore(dayjs(currentDate))) {
        pastBookings.innerHTML += `<h2>Past Bookings</h2>`
        pastBookings.innerHTML += roomCard.innerHTML;
      } else {
        upcomingBookings.innerHTML += `<h2>Upcoming Bookings</h2>`
        upcomingBookings.innerHTML += roomCard.innerHTML;
      }
    })
  })

  const totalUserPayments = userBookingList.getTotalDollarsSpent(roomRepository)

  userPayments.innerHTML += `
  <p>You have spent $${Math.round(totalUserPayments)}</p>
  `;
  dashboardHeading.innerText = user.name;
}

const hide = (element) => element.classList.add('hidden');
const show = (element) => element.classList.remove('hidden');