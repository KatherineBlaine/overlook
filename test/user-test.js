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
  let roomRepo;
  let user1;
  let user2;
  let bookingsRepository;
  beforeEach(() => {
    bookingsRepository = new BookingsRepository(bookingsSampleData, Booking);
    roomRepo = new RoomRepository(roomsSampleData);
    user1 = new User(usersSampleData[0], bookingsRepository.allBookings, roomRepo.rooms, '2022/01/01')
    user2 = new User(usersSampleData[4], bookingsRepository.allBookings, roomRepo.rooms, '2022/01/01')
  })

  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should have a name', () => {
    expect(user1.name).to.equal("Leatha Ullrich")
  })

  it('should have an id', () => {
    expect(user1.id).to.equal(1)
  })

  it('should have a list of bookings', () => {
    expect(user1.allBookings).to.be.an('array')
    expect(user1.allBookings).to.deep.equal([  
      {
      "id": "5fwrgu4i7k55hl6t8",
      "userID": 1,
      "date": "2022/02/05",
      "roomNumber": 12, 
      }])
    })

    it('should be able to find past bookings', () => {
      expect(user1.getPastBookings('2023/02/05')).to.deep.equal([  
        {
        "id": "5fwrgu4i7k55hl6t8",
        "userID": 1,
        "date": "2022/02/05",
        "roomNumber": 12, 
        }])
    })

    it('should be able to find upcoming bookings', () => {
      expect(user1.getUpcomingBookings('2021/02/05')).to.deep.equal([  
        {
        "id": "5fwrgu4i7k55hl6t8",
        "userID": 1,
        "date": "2022/02/05",
        "roomNumber": 12, 
        }])
    })

    it('should be able to calculate how much a user has spend on bookings', () => {
      expect(user2.totalSpendings).to.be.a('number')
      expect(user2.getTotalSpendings(roomRepo.rooms)).to.equal(200.39)
    })
});
