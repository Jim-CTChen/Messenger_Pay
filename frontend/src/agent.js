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

const Activity = {
  createActivity: async (body) => await axios.post('/activity', body),
  getFriendActivity: async (user, friend) =>
    await axios.get(`/activity/friend?username=${user}&friendName=${friend}`),
}

export default {
  User,
  Activity
}