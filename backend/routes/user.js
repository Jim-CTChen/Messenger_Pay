const express = require("express");
const api = express.Router();

import { User } from '../model/models'
import handleMissing from './utility'

api.get('/', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    const user = await User.find();
    return res.status(200).send({
      success: true,
      error: null,
      data: user
    });
  }
  else {
    const user = await User.findOne({ username: username });
    return res.status(200).send({
      success: true,
      error: null,
      data: user
    });
  }
})

api.post('/login', async (req, res) => {
  const requiredList = ['username', 'password'];
  const missing = handleMissing(requiredList, req.body);
  if (missing) {
    return res.status(200).send({
      success: false,
      error: missing,
      data: null
    });
  }
  const { username, password } = req.body;
  let user = await User.findOne({ username: username });
  if (!user) {
    return res.status(200).send({
      success: false,
      error: `Username ${username} not found!`,
      data: null
    });
  }
  if (user.password !== password) {
    return res.status(200).send({
      success: false,
      error: 'Password incorrect!',
      data: null
    });
  }
  else {
    return res.status(200).send({
      success: true,
      error: null,
      data: user
    });
  }
});

api.post('/', async (req, res) => {
  const requiredList = ['username', 'password', 'name'];
  const missing = handleMissing(requiredList, req.body);
  if (missing) {
    return res.status(200).send({
      success: false,
      error: missing,
      data: null
    });
  }
  const { username, password, name } = req.body;
  let newUser = new User({
    username: username,
    password: password,
    name: name
  })
  newUser.save(err => {
    if (err && err.code === 11000) {
      return res.status(200).send({
        success: false,
        error: `Username has been used!`,
        data: null
      });
    }
    else {
      return res.status(200).send({
        success: true,
        error: null,
        data: newUser
      });
    }
  })
})


export default api;