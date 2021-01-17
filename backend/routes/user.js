const express = require("express");
const api = express.Router();

import { User } from '../model/models'
import handleMissing from '../middleware/utility'
import requirement from '../middleware/require'

api.use((req, res, next) => { // check required 
  const requiredList = requirement.user[`${req.method}`][`${req.path}`];
  const payload = (req.method === 'GET') ? req.query : req.body;
  const missing = handleMissing(requiredList, payload);
  if (missing) {
    return res.status(200).send({
      success: false,
      error: missing,
      data: null
    });
  }
  next();
})

api.get('/', async (req, res) => {
  const { username } = req.query;
  const user = await User
    .findOne({ username: username })
    .select('events groups -_id')
    .populate({
      path: 'events',
      select: '-_id -__v',
      populate: [
        { path: 'creditor', select: 'username-_id', model: 'user' },
        { path: 'debtor', select: 'username-_id', model: 'user' }
      ]
    })
    .populate({
      path: 'groups',
      select: 'groupName events',
      populate: {
        path: 'events',
        populate: [
          { path: 'creditor', select: 'username-_id', model: 'user' },
          { path: 'debtor', select: 'username-_id', model: 'user' }
        ]
      }
    })

  if (!user) {
    return res.status(200).send({
      success: false,
      error: `User ${username} not found!`,
      data: null
    });
  }

  const usernames = [];
  const balances = [];
  let amount = 0;
  let friendName = '';
  user.events.forEach(event => {
    if (event.creditor.username === username) {
      amount = event.amount;
      friendName = event.debtor.username;
    } else {
      amount = -event.amount;
      friendName = event.creditor.username;
    }
    let index = usernames.findIndex(f => f === friendName);
    if (index !== -1) {
      balances[index] += amount;
    }
    else {
      usernames.push(friendName);
      balances.push(amount);
    }
  });
  const friends = usernames.map((name, idx) => {
    return {
      username: name,
      balance: balances[idx]
    }
  })

  const groups = user.groups.map(group => {
    let balance = 0;
    group.events.forEach(event => {
      if (event.creditor.username === username) balance += event.amount;
      else if (event.debtor.username === username) balance -= event.amount;
    })
    return {
      id: group._id,
      groupName: group.groupName,
      balance: balance
    }
  })

  return res.status(200).send({
    success: true,
    error: null,
    data: {
      username: username,
      friends: friends,
      groups: groups
    }
  });
})

api.post('/login', async (req, res) => {
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
      error: 'Incorrect password!',
      data: null
    });
  }
  else {
    return res.status(200).send({
      success: true,
      error: null,
      data: `${user.username} login successfully!`
    });
  }
});

api.post('/', async (req, res) => {
  const { username, password, name } = req.body;
  let newUser = new User({
    username: username,
    password: password,
    name: name
  })
  newUser.save(err => {
    console.log('err', err)
    if (err && err.code === 11000) {
      return res.status(200).send({
        success: false,
        error: `Username ${username} has been used!`,
        data: null
      });
    }
    else {
      return res.status(200).send({
        success: true,
        error: null,
        data: {
          username: newUser.username,
          name: newUser.name
        }
      });
    }
  })
})

export default api;