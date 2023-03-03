class BookingsRepository {
  constructor(bookings, Booking) {
    this.allBookings = bookings.map(booking => new Booking(booking))
  }
}

export default BookingsRepository;