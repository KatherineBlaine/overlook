import Room from '../classes/rooms-class';

class RoomRepository {
  constructor(rooms) {
    this.roomRepository = rooms.map(room => new Room(room));
  }

  filterByRoomType(roomType) {
    return this.roomRepository.filter(room => room.roomType === roomType);
  }

  filterByDate(date, bookings) {
    const availability = bookings.filter(booking => booking.date !== date)
    return [... new Set(availability.map(booking => booking.roomNumber))]
  }


}

export default RoomRepository;