class Room {
  constructor(roomData) {
    this.number = roomData.number;
    this.roomType = roomData.roomType;
    this.bidet = roomData.bidet;
    this.bedSize = roomData.bedSize;
    this.numBeds = roomData.numBeds;
    this.costPerNight = roomData.costPerNight;
  }

  findUnavailableDates(bookingsRepository) {
    let roomBookings = bookingsRepository.filter(booking => booking.roomNumber === this.number);
    return roomBookings.map(roomBooking => roomBooking.date);
  }

}

export default Room;