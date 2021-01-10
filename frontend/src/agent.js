import axios from 'axios'
import { API_ROOT } from './constants/config'


axios.defaults.baseURL = API_ROOT
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common.Accept = 'application/json'

const User = {
  login: async (body) => await axios.post('/user/login', body),
  createUser: async (body) => await axios.post('/user', body)
}

export default {
  User
}