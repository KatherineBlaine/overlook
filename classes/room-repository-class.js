import Room from '../classes/rooms-class';

class RoomRepository {
  constructor(rooms) {
    this.rooms = rooms.map(room => new Room(room));
  }

  filterByRoomType(roomType) {
    return this.rooms.filter(room => room.roomType === roomType);
  }

  filterByDate(date, bookings) {
    return this.rooms.filter(room => !room.findUnavailableDates(bookings).includes(date))
  }
}

export default RoomRepository;