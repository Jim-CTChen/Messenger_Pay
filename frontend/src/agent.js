import axios from 'axios'
import { API_ROOT } from './constants/config'


axios.defaults.baseURL = API_ROOT
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common.Accept = 'application/json'
axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('jwt')
axios.defaults.headers.common.token = window.localStorage.getItem('jwt')
// axios.defaults.headers.common['Authorization'] =
//   'Bearer ' + localStorage.getItem('jwt');

const Auth = {
  authorization: async () => await axios.get('/auth')
}

const User = {
  login: async (body) => {
    const result = await axios.post('/user/login', body);
    if (result.data.success) {
      axios.defaults.headers.common.token = result.data.data;
      window.localStorage.setItem('jwt', result.data.data);
    }
    return result
  },
  createUser: async (body) => await axios.post('/user', body),
  getUserInfo: async (name) => await axios.get(`/user?username=${name}`)
}

const Event = {
  createEvent: async (body) => await axios.post('/event', body),
  getFriendEvent: async (user, friend) =>
    await axios.get(`/event/friend?username=${user}&friendName=${friend}`),
  updateEvent: async (body) => await axios.put('/event', body)
}

const Group = {
  createGroup: async (body) => await axios.post('/group', body),
  getGroupEvent: async (user, id) =>
    await axios.get(`/group?username=${user}&groupId=${id}`),
  addUser: async (body) => await axios.post('/group/addUser', body),
  removeUser: async (body) => await axios.post('/group/removeUser', body)
}

export default {
  Auth,
  User,
  Event,
  Group
}