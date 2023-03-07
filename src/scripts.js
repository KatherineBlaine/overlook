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
let user, bookings, roomRepository, selectedDateData, selectedDateDOM, currentRooms, roomCards, selectedRoom, dashboardView, currentUserName, currentUserPassword;
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
const bookingDataButton = document.getElementById('booking-data');
const bookingDataTable = document.getElementById('user-table')
const loginButton = document.getElementById('login-button')
const usernameInput = document.getElementById('username-input')
const passwordInput = document.getElementById('password-input')
const header = document.getElementById('header')
const loginPage = document.getElementById('login-page')

const homeImage = document.getElementById('main-image');


loginButton.addEventListener('click', () => {
  fetchAllData()
    .then(data => {
      storeLoginData()
      const userData = data[0].customers;
      const roomData = data[1].rooms;
      const bookingData = data[2].bookings;
      bookings = bookingData.map(booking => new Booking(booking));
      roomRepository = new RoomRepository(roomData);
      let currentUser = userData.find(user => `customer${user.id}` === currentUserName)
      user = new User(currentUser, bookings, roomRepository.rooms, currentDate);
      // console.log(user)
      currentRooms = roomRepository.rooms;
      populateMainPage(currentRooms);
      populateRoomTypeDropdown(currentRooms);
      populateUserDashboard();
      hide(loginPage)
      show(header)
      show(homeImage)
    })
})

const storeLoginData = () => {
  currentUserName = usernameInput.value;
  currentUserPassword = passwordInput.value;
}



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
  } else if (view === 'data') {
    hide(bookingDataTable)
  } else if (view === 'confirmation') {
    hide(confirmationPage)
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
  } else if (view === 'data') {
    hide(bookingDataTable)
  } else if (view === 'confirmation') {
    hide(confirmationPage);
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
  } else if (view === 'data') {
    hide(bookingDataTable);
  } else if (view === 'confirmation') {
    hide(confirmationPage)
  }
  show(homeImage)
  hide(homeButton)
  view = 'home'
})

bookingDataButton.addEventListener('click', () => {
  populateUserDataTable();
})

const populateUserDataTable = () => {
  bookingDataTable.innerHTML = '';
bookingDataTable.innerHTML += `
  <tr>
    <th>Room Type</th>
    <th>Room Number</th>
    <th>Date</th>
    <th>Price</th>
  </tr>`

  
  user.allBookings.forEach(userBooking => {
    roomRepository.rooms.forEach(room => {
      if (room.number === userBooking.roomNumber) {
        bookingDataTable.innerHTML += `
        <tr>
          <th>${room.roomType}</th>
          <th>${userBooking.roomNumber}</th>
          <th>${userBooking.date}</th>
          <th>${room.costPerNight}</th>
        </tr>
        `
      }
    })
  })

  const totalUserPayments = user.getTotalSpendings(roomRepository.rooms)
  bookingDataTable.innerHTML += `
  <tr>
    <th>Total Spendings</th>
    <th>${Math.round(totalUserPayments)}</th>
  </tr>
  `

  show(bookingDataTable)
  hide(userDashboard)
  show(myBookingsButton)
  view = 'data';
}

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

  homeImage.innerHTML = '<img class="main-image" src="./images/overlook-hotel.png" alt="image of Overlook Hotel">'
  
  roomsToDisplay.forEach(room => {
    allRoomCards.innerHTML += `
    <figure tabindex='0' class="room-card card-data" id="${room.number}">
      <img class="card-data" src="./images/hotel-room.png" alt="image of ${room.roomType}">
        <h2 class="card-data">${room.roomType}</h2>
        <h3 class="card-data">${room.numBeds} ${room.bedSize} bed</h3>
        <p class="card-data">$${room.costPerNight} per night</p>
      </figcaption>
    </figure>
    `;
  })

  roomCards = document.querySelectorAll('.room-card');
  roomCards.forEach(roomCard => {
  roomCard.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      roomCard.click();
    } 
  })
  })

  roomCards = document.querySelectorAll('.room-card');

  roomCards.forEach(roomCard => {
    roomCard.addEventListener('click', (event) => {
      let selectedRoomNum;
      resetSelected();
      if (event.target.className === 'card-data') {
        event.target.parentNode.classList.add('selected-room-card')
        selectedRoomNum = event.target.parentNode.id;
      } else if(event.target.className.includes('card-data')) {
        event.target.classList.add('selected-room-card')
        selectedRoomNum = event.target.id;
      }
      selectedRoom = roomRepository.rooms.find(room => selectedRoomNum === room.number.toString())
      checkQueryConditions();
    })
  })
}

const checkQueryConditions = () => {
  if (selectedDateData) {
    show(footer)
  }
}

const resetSelected = () => {
  roomCards.forEach(card => {
    if (card.className.includes('selected-room-card')) {
      card.classList.remove('selected-room-card')
    }
  })
}

const populateUserDashboard = () => {
  const userBookingList = user.allBookings;

  userBookingList.forEach(userBooking => {
    roomCards.forEach(roomCard => {
      if (userBooking.roomNumber.toString() === roomCard.id && dayjs(userBooking.date).isBefore(dayjs(currentDate))) {
        pastBookings.innerHTML += roomCard.innerHTML;
        pastBookings.innerHTML += `<p>${userBooking.date}</p>`
      } else if (userBooking.roomNumber.toString() === roomCard.id && dayjs(userBooking.date).isAfter(dayjs(currentDate))){
        upcomingBookings.innerHTML += roomCard.innerHTML;
        upcomingBookings.innerHTML += `<p>${userBooking.date}</p>`
      }
    })
  })
}

const hide = (element) => element.classList.add('hidden');
const show = (element) => element.classList.remove('hidden');