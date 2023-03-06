import dayjs from 'dayjs';

class User {
  constructor(userData, bookingsRepository, allRooms, todaysDate) {
    this.id = userData.id;
    this.name = userData.name;
    this.allBookings = this.getAllBookings(bookingsRepository);
    this.pastBookings = this.getPastBookings(todaysDate)
    this.upcomingBookings = this.getUpcomingBookings(todaysDate);
    this.totalSpendings = this.getTotalSpendings(allRooms);
  }

  getAllBookings(bookingsRepository) {
    return bookingsRepository.filter(booking => booking.userID === this.id && booking.date)
  }

  getPastBookings(todaysDate) {
    return this.allBookings.filter(booking => dayjs(todaysDate).isAfter(booking.date))
  }

  getUpcomingBookings(todaysDate) {
    return this.allBookings.filter(booking => dayjs(todaysDate).isBefore(booking.date))
  }

  getTotalSpendings(allRooms) {
    return this.allBookings.reduce((accumulator, currentBooking) => {
      allRooms.forEach(room => {
        if(room.number === currentBooking.roomNumber) {
          accumulator += room.costPerNight;
        }
      })
      return accumulator;
    }, 0)
  }

}

export default User;