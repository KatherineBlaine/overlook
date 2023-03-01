import chai from 'chai';
import usersSampleData from '../sample-data/users-sample-data';
import User from '../classes/user-class';
const expect = chai.expect;

describe('User class', () => {
  let user;
  beforeEach(() => {
    user = new User(usersSampleData[0])
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
});
