import './css/styles.css';
import './images/turing-logo.png'
import fetchAllData from '../api-calls';
import User from '../classes/user-class';
import Booking from '../classes/bookings-class';
import Room from '../classes/rooms-class';
import dayjs from 'dayjs';


let view = 'main';
let user, bookings, allRooms, selectedDateData, selectedDateDOM, currentRooms, roomCards, selectedRoom;

const navButton = document.getElementById('nav-button');
const mainPage = document.getElementById('main-page');
const userDashboard = document.getElementById('user-dashboard');
const userGreeting = document.getElementById('user-greeting');
const allRoomCards = document.getElementById('all-room-cards');
const userBookings = document.getElementById('user-bookings')
const userPayments = document.getElementById('user-payments');
const dashboardHeading = document.getElementById('dashboard-username');
const navBar = document.getElementById('navigate-rooms');
const datepicker = document.getElementById('datepicker');
const roomTypeDropdown = document.getElementById('room-type-dropdown');
const footer = document.getElementById('footer');
const bookRoomButton = document.getElementById('book-room-button');
const bookingPage = document.getElementById('booking-page')

window.addEventListener('load', () => {
  fetchAllData()
    .then(data => {
      const userData = data[0].customers;
      const roomData = data[1].rooms;
      const bookingData = data[2].bookings;
      user = new User(userData[0]);
      bookings = bookingData.map(booking => new Booking(booking));
      allRooms = roomData.map(room => new Room(room));
      currentRooms = allRooms;
      populateMainPage(currentRooms);
      populateRoomTypeDropdown(currentRooms);
      populateUserDashboard();
    })
})

bookRoomButton.addEventListener('click', () => {
  hide(footer)
  populateBookingPage();
})

roomTypeDropdown.addEventListener('change', () => {
  filterRoomsByType();
})

datepicker.addEventListener('change', () => {
  pickDate();
  filterAllRoomsByDate();
})

const populateBookingPage = () => {
  bookingPage.innerHTML = `
  <h1>Book Room ${selectedRoom.number} at Overlook Hotel for ${selectedDateDOM}</h1>
  <h2>${selectedRoom.roomType}</h2>
  <h3>${selectedRoom.numBeds}${selectedRoom.bedSize}</h3>
  <h4>${selectedRoom.costPerNight} per night</h4>
  <button>Confirm Booking</button>
  `
  view = 'booking'
  hide(mainPage);
  show(bookingPage);

}

const filterRoomsByType = () => {
  if (roomTypeDropdown.value !== 'select-value') {
    let filteredRooms = currentRooms.filter(room => room.roomType === roomTypeDropdown.value);
    resetPage();
    populateMainPage(filteredRooms);
  } else {
    resetPage();
    populateMainPage(allRooms);
  }
}

const pickDate = () => {
  if (roomTypeDropdown.value !== 'select-value') {
    roomTypeDropdown.value = 'select-value';
  }
  selectedDateData = dayjs(datepicker.value).format('YYYY/MM/DD');
  selectedDateDOM = dayjs(datepicker.value).format('MM/DD/YYYY');
}

const filterAllRoomsByDate = () => {
  let unavailableRoomNums = bookings.filter(booking => booking.date === selectedDateData).map(booking => booking.roomNumber);

  currentRooms = allRooms.filter(room => !unavailableRoomNums.includes(room.number));

  resetPage();
  populateMainPage(currentRooms);
}

const resetPage = () => {
  userGreeting.innerText = '';
  allRoomCards.innerHTML = '';
}

// DOM

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
  
  roomsToDisplay.forEach(room => {
    allRoomCards.innerHTML += `
    <figure class="room-card card-data" id="${room.number}">
        <h3 class="card-data">${room.roomType}</h3>
        <p class="card-data">Room #${room.number}</p>
        <p class="card-data">Beds: ${room.numBeds}</p>
        <p class="card-data">Price: $${room.costPerNight}</p>
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
      selectedRoom = allRooms.find(room => selectedRoomNum === room.number.toString())
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
  const userBookingList = bookings.filter(booking => booking.userID === user.id);

  userBookingList.forEach(userBooking => {
    userBookings.innerHTML += `
    <p>You have room ${userBooking.roomNumber} booked for ${userBooking.date}
    `;
  })

  const totalUserPayments = userBookingList.reduce((accumulator, currentBooking) => {
    allRooms.forEach(room => {
      if (currentBooking.roomNumber === room.number) {
        accumulator += room.costPerNight;
      }
    })
    return accumulator;
  }, 0)

  userPayments.innerHTML += `
  <p>You have spent $${Math.round(totalUserPayments)}</p>
  `;
  dashboardHeading.innerText = user.name;
}


navButton.addEventListener('click', () => {
  if (view === 'main') {
    hide(mainPage);
    show(userDashboard);
    hide(footer)
    view = 'dashboard';
    navButton.innerText = 'Home';
  } else if (view === 'dashboard') {
    show(mainPage);
    hide(userDashboard);
    hide(footer)
    view = 'main';
    navButton.innerText = 'My Bookings';
  } else if (view === 'booking') {
    hide(bookingPage);
    show(userDashboard);
    hide(footer)
    resetSelected()
    navButton.innerText = 'Home';
    bookRoomButton.innerText = 'Book Room'
    view = 'dashboard'
  }
})

const hide = (element) => element.classList.add('hidden');
const show = (element) => element.classList.remove('hidden');