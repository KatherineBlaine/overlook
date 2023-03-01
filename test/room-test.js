import chai from 'chai';
import roomsSampleData from '../sample-data/rooms-sample-data';
import Room from '../classes/rooms-class';
const expect = chai.expect;

describe('Room class', () => {
  let room;
  beforeEach(() => {
    room = new Room(roomsSampleData[0])
  })

  it('should be a function', () => {
    expect(Room).to.be.a('function')
  })

  it('should have a number', () => {
    expect(room.number).to.equal(1)
  })

  it('should have a room type', () => {
    expect(room.roomType).to.equal("residential suite")
  })

  it('should have a boolean property value for whether or not it has a bidet', () => {
    expect(room.bidet).to.equal(true)
  })

  it('should have a bed size', () => {
    expect(room.bedSize).to.equal('queen');
  })

  it('should have a number of beds', () => {
    expect(room.numBeds).to.equal(1);
  })

  it('should have a price per night', () => {
    expect(room.costPerNight).to.equal(358.4)
  })

});