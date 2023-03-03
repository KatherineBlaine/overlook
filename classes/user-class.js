class User {
  constructor(userData, bookingsRepository, rooms) {
    this.id = userData.id;
    this.name = userData.name;
    this.userBookings = this.getUserBookings(bookingsRepository);
    this.totalDollarsSpent = this.getTotalDollarsSpent(rooms);
  }

  getUserBookings(bookingsRepository) {
    return bookingsRepository.filter(booking => booking.userID === this.id)
  }

  getTotalDollarsSpent(rooms) {
    return this.userBookings.reduce((accumulator, currentBooking) => {
      rooms.forEach(room => {
        if(room.number === currentBooking.roomNumber) {
          accumulator += room.costPerNight;
        }
      })
      return accumulator;
    }, 0)
  }

}

export default User;