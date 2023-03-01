import chai from 'chai';
import bookingsSampleData from '../sample-data/bookings-sample-data';
import Booking from '../classes/bookings-class';
const expect = chai.expect;

describe('booking class', () => {
  let booking;
  beforeEach(() => {
    booking = new Booking(bookingsSampleData[0])
  })

  it('should be a function', () => {
    expect(Booking).to.be.a('function');
  })

  it('should have an id', () => {
    expect(booking.id).to.equal("5fwrgu4i7k55hl6sz")
  })

  it('should have a userID', () => {
    expect(booking.userID).to.equal(9)
  })

  it('should have a date', () => {
    expect(booking.date).to.equal("2022/04/22")
  })

  it('should have a room number', () => {
    expect(booking.roomNumber).to.equal(15)
  })


})

