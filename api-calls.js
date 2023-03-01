const fetchApi = (url) => {
  return fetch(`http://localhost:3001/api/v1/${url}`)
    .then((response) => response.json());
}

const fetchAllData = () => {
  return Promise.all([
    fetchApi('customers'),
    fetchApi('rooms'),
    fetchApi('bookings')
  ])
}

const postNewBooking = (userID, date, roomNumber) => {
  return fetch('http://localhost:3001/api/v1/bookings', {
    method: 'POST',
    body: JSON.stringify({ "userID": userID, "date": date, "roomNumber": roomNumber }), 
    headers: {
     'Content-Type': 'application/json'
  }})
    .then(response => response.json())
}

export {fetchAllData, postNewBooking};