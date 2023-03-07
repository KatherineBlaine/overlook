import chai, { assert } from 'chai';
import roomsSampleData from '../sample-data/rooms-sample-data';
import RoomRepository from '../classes/room-repository-class';
import BookingsRepository from '../classes/bookings-repository';
import Booking from '../classes/booking-class';
import bookingsSampleData from '../sample-data/bookings-sample-data';
// import Room from '../classes/rooms-class';
const expect = chai.expect;

describe('roomRepository', () => {
  let roomRepo, bookings;
  beforeEach(() => {
    roomRepo = new RoomRepository(roomsSampleData);
    bookings = new BookingsRepository(bookingsSampleData, Booking)
  })

  it('should be a function', () => {
    expect(RoomRepository).to.be.a('function')
  })

  it('should have an array of Room objects', () => {
    expect(roomRepo.rooms).to.be.an('array')
    expect(roomRepo.rooms[0]).to.be.an('object')
  })

  it('should be able to filter rooms by room type', () => {
    const filteredRooms = roomRepo.filterByRoomType('suite');

    expect(filteredRooms.length).to.equal(2);
    expect(filteredRooms).to.deep.equal([  
      {
      "number": 2,
      "roomType": "suite",
      "bedSize": "full",
      "numBeds": 2,
      "costPerNight": 477.38
    },   
    {
      "number": 10,
      "roomType": "suite",
      "bedSize": "twin",
      "numBeds": 1,
      "costPerNight": 497.64
    }
    ])
  })

  it('should be able to filter rooms by date availability', () => {
    const filteredBookingsByDate = roomRepo.filterByDate('2022/04/22', bookings.allBookings)

    expect(filteredBookingsByDate.length).to.equal(10)
    expect(filteredBookingsByDate[0]).to.equal({
      "bedSize": "queen",
      "costPerNight": 358.4,
      "numBeds": 1,
      "number": 1,
      "roomType": "residential suite"})
  })
})