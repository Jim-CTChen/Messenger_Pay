import axios from 'axios'
import { API_ROOT } from './constants/config'


axios.defaults.baseURL = API_ROOT
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common.Accept = 'application/json'

const User = {
  login: async (body) => await axios.post('/user/login', body),
  createUser: async (body) => await axios.post('/user', body),
  getUserInfo: async (name) => await axios.get(`/user?username=${name}`)
}

const Event = {
  createEvent: async (body) => await axios.post('/event', body),
  getFriendEvent: async (user, friend) =>
    await axios.get(`/event/friend?username=${user}&friendName=${friend}`),
}

const Group = {
  getGroupEvent: async (user, id) =>
    await axios.get(`/group?username=${user}&groupId=${id}`),
}

export default {
  User,
  Event,
  Group
}