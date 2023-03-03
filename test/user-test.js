import chai from 'chai';
import usersSampleData from '../sample-data/users-sample-data';
import Booking from '../classes/booking-class';
import BookingsRepository from '../classes/bookings-repository';
import User from '../classes/user-class';
import bookingsSampleData from '../sample-data/bookings-sample-data';
import RoomRepository from '../classes/room-repository-class';
import Room from '../classes/rooms-class';
import roomsSampleData from '../sample-data/rooms-sample-data';

const expect = chai.expect;

describe('User class', () => {
  let rooms;
  let user;
  let bookingsRepository;
  beforeEach(() => {
    bookingsRepository = new BookingsRepository(bookingsSampleData, Booking);
    rooms = new RoomRepository(roomsSampleData);
    user = new User(usersSampleData[0], bookingsRepository.allBookings, rooms.roomRepository)
  })

  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should have a name', () => {
    expect(user.name).to.equal("Leatha Ullrich")
  })

  it('should have an id', () => {
    expect(user.id).to.equal(1)
  })

  it('should have a list of bookings', () => {
    expect(user.userBookings).to.be.an('array')
    expect(user.userBookings).to.deep.equal([  
      {
      "id": "5fwrgu4i7k55hl6t8",
      "userID": 1,
      "date": "2022/02/05",
      "roomNumber": 12, 
      }])
    })

    it('should be able to calculate how much a user has spend on bookings', () => {
      expect(user.totalDollarsSpent).to.be.a('number')
    })
});
