import chai, { assert } from 'chai';
import BookingsRepository from '../classes/bookings-repository';
import Booking from '../classes/booking-class';
import bookingsSampleData from '../sample-data/bookings-sample-data';
// import Room from '../classes/rooms-class';
const expect = chai.expect;

describe('Bookings Repository Class', () => {
  let bookings;
  beforeEach(() => {
    bookings = new BookingsRepository(bookingsSampleData, Booking)
  })

  it('should be a function', () => {
    expect(BookingsRepository).to.be.a('function')
  })

  it('should have an array of booking objects', () => {
    expect(bookings.allBookings).to.be.an('array')
    expect(bookings.allBookings[0]).to.be.an('object')
  })
})