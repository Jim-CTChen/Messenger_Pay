const express = require("express");
const api = express.Router();

import { Event, User, Group } from '../model/models'
import handleMissing from '../middleware/utility'
import requirement from '../middleware/require'
import { EVENT_TYPE } from '../constants/enum'

api.use((req, res, next) => { // check required 
  const requiredList = requirement.event[`${req.method}`][`${req.path}`];
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

api.get('/all', async (req, res) => {
  const { username } = req.query;
  const user = await User
    .findOne({ username: username })
    .select('events -_id')
    .populate({
      path: 'events',
      select: '-__v',
      populate: [
        { path: 'creditor', select: 'username-_id', model: 'user' },
        { path: 'debtor', select: 'username-_id', model: 'user' }
      ]
    })

  let friendName = '';
  let amount = 0;
  let newEvent = {};
  const usernames = [];
  const balances = [];
  const events = [];
  user.events.forEach(event => {
    if (event.creditor.username === username) {
      amount = event.amount;
      friendName = event.debtor.username;
    }
    else {
      amount = -event.amount;
      friendName = event.creditor.username;
    }
    let index = usernames.findIndex(f => f === friendName);
    newEvent = {
      id: event._id,
      amount: amount,
      type: event.type,
      description: event.description,
      time: event.time
    }
    if (index !== -1) {
      balances[index] += amount;
      events[index].push(newEvent);
    }
    else {
      usernames.push(friendName);
      balances.push(amount);
      events.push([newEvent]);
    }
  })

  const friends = usernames.map((name, idx) => {
    return {
      username: name,
      balance: balances[idx],
      events: events[idx]
    }
  })

  const groups = []

  return res.status(200).send({
    success: true,
    error: null,
    data: {
      username: username,
      friends: friends,
      groups: groups
    }
  })
})

api.get('/friend', async (req, res) => {
  const { username, friendName } = req.query;
  const user = await User
    .findOne({ username: username })
    .select('events -_id')
    .populate({
      path: 'events',
      select: '-__v',
      populate: [
        { path: 'creditor', select: 'username-_id', model: 'user' },
        { path: 'debtor', select: 'username-_id', model: 'user' }
      ]
    })

  let amount = 0;
  const events = user.events
    .filter(event => event.creditor.username === friendName || event.debtor.username === friendName)
    .map(event => {
      if (event.creditor.username === friendName) {
        amount = -event.amount;
      } else {
        amount = event.amount;
      }
      return {
        id: event._id,
        amount: amount,
        type: event.type,
        description: event.description,
        time: event.timestamp
      }
    })
  return res.status(200).send({
    success: true,
    error: null,
    data: {
      friend: friendName,
      events: events
    }
  })
})

api.post('/', async (req, res) => {
  const { creditor, debtor, amount, description, type, groupId } = req.body;
  if (!EVENT_TYPE.includes(type)) {
    return res.status(200).send({
      success: false,
      error: 'Type must be \'PERSONAL or \'GROUP !',
      data: null
    });
  }
  if (creditor === debtor) {
    return res.status(200).send({
      success: false,
      error: 'Creditor & debtor are the same!',
      data: null
    });
  }
  const creditorUser = await User.findOne({ username: creditor });
  if (!creditorUser) {
    return res.status(200).send({
      success: false,
      error: `User ${creditor} not found!`,
      data: null
    });
  }
  const debtorUser = await User.findOne({ username: debtor });
  if (!debtorUser) {
    return res.status(200).send({
      success: false,
      error: `User ${debtor} not found!`,
      data: null
    });
  }

  const group = await Group.findById(groupId);
  if (type === 'GROUP') {
    if (!groupId) {
      return res.status(200).send({
        success: false,
        error: `Group Id not provided!`,
        data: null
      });
    }
    if (!group) {
      return res.status(200).send({
        success: false,
        error: `Group with id ${groupId} not found!`,
        data: null
      });
    }
    if (!group.users.includes(creditorUser._id)) {
      return res.status(200).send({
        success: false,
        error: `User ${creditor} is not in group!`,
        data: null
      });
    }
    if (!group.users.includes(debtorUser._id)) {
      return res.status(200).send({
        success: false,
        error: `User ${debtor} is not in group!`,
        data: null
      });
    }
  }

  const newEvent = new Event({
    creditor: creditorUser._id,
    debtor: debtorUser._id,
    amount: Number(amount),
    description: description,
    type: type,
    groupId: groupId
  });

  await newEvent.save();
  creditorUser.events.push(newEvent._id);
  debtorUser.events.push(newEvent._id);
  await creditorUser.save();
  await debtorUser.save();
  if (type === 'GROUP') {
    group.events.push(newEvent._id);
    await group.save();
  }
  return res.status(200).send({
    success: true,
    error: null,
    data: null
  });

})

api.put('/', async (req, res) => {
  const { id, amount, description } = req.body;
  const event = await Event
    .findById(id, { '__v': 0 })
    .populate({
      path: 'creditor',
      select: 'username-_id',
      model: 'user'
    })
    .populate({
      path: 'debtor',
      select: 'username-_id',
      model: 'user'
    });
  event.amount = amount ? amount : event.amount;
  event.description = description ? description : event.description;
  await event.save()
  return res.status(200).send({
    success: true,
    error: null,
    data: event
  });
})

export default api;