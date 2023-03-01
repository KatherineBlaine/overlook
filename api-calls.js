
const fetchApi = (url) => {
  return fetch(`http://localhost:3001/api/v1/${url}`)
    .then((response) => response.json())
}

const fetchAllData = () => {
  return Promise.all([
    fetchApi('customers'),
    fetchApi('rooms'),
    fetchApi('bookings')
  ])
}

export default fetchAllData;