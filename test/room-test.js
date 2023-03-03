import chai from 'chai';
import roomsSampleData from '../sample-data/rooms-sample-data';
import Room from '../classes/rooms-class';
import BookingsRepository from '../classes/bookings-repository';
import Booking from '../classes/booking-class';
import bookingsSampleData from '../sample-data/bookings-sample-data';
const expect = chai.expect;

describe('Room class', () => {
  let room1;
  let room9;
  let bookings;
  beforeEach(() => {
    room1 = new Room(roomsSampleData[0])
    room9 = new Room(roomsSampleData[8])
    bookings = new BookingsRepository(bookingsSampleData, Booking)
  })

  it('should be a function', () => {
    expect(Room).to.be.a('function')
  })

  it('should have a number', () => {
    expect(room1.number).to.equal(1)
  })

  it('should have a room type', () => {
    expect(room1.roomType).to.equal("residential suite")
  })

  it('should have a boolean property value for whether or not it has a bidet', () => {
    expect(room1.bidet).to.equal(true)
  })

  it('should have a bed size', () => {
    expect(room1.bedSize).to.equal('queen');
  })

  it('should have a number of beds', () => {
    expect(room1.numBeds).to.equal(1);
  })

  it('should have a price per night', () => {
    expect(room1.costPerNight).to.equal(358.4)
  })

  it('should be able to create a list of unavailable dates', () => {
    expect(room9.findUnavailableDates(bookings.allBookings)).to.be.an('array');  
    expect(room9.findUnavailableDates(bookings.allBookings)).to.deep.equal(["2022/01/11"])  
  })

});