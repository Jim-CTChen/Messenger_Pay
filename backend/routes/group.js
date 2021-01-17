const express = require("express");
const api = express.Router();

import { Event, User, Group } from '../model/models'
import handleMissing from '../middleware/utility'
import requirement from '../middleware/require'

api.use((req, res, next) => { // check required 
  const requiredList = requirement.group[`${req.method}`][`${req.path}`];
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
  const { username, groupId } = req.query;
  const group = await Group
    .findById(groupId)
    .select('events users')
    .populate('users', 'username-_id')
    .populate({
      path: 'events',
      select: '-__v',
      populate: [
        { path: 'creditor', select: 'username-_id', model: 'user' },
        { path: 'debtor', select: 'username-_id', model: 'user' }
      ]
    });
  if (!group) {
    return res.status(200).send({
      success: false,
      error: `Group not found!`,
      data: null
    });
  }
  // check user is in group
  if (!group.users.some(user => user.username === username)) {
    return res.status(200).send({
      success: false,
      error: `User ${username} is not in group!`,
      data: null
    });
  }
  let balance = 0;
  const userList = group.users.map(user => user.username);
  const eventList = group.events.map(event => {
    if (event.creditor.username === username) {
      balance += event.amount;
    }
    else if (event.debtor.username === username) {
      balance -= event.amount;
    }
    return {
      id: event._id,
      amount: event.amount,
      type: event.type,
      creditor: event.creditor.username,
      debtor: event.debtor.username,
      description: event.description,
      time: event.timestamp
    };
  })

  return res.status(200).send({
    success: true,
    error: null,
    data: {
      id: groupId,
      balance: balance,
      users: userList,
      events: eventList
    }
  });
})

api.post('/', async (req, res) => {
  const { groupName, usernames } = req.body;
  const userList = await User
    .find({ username: { $in: usernames } })
    .select('_id username');
  const idList = userList.map(user => user._id);
  const nameList = userList.map(user => user.username);

  if (idList.length === 0) {
    console.log('list', idList)
    return res.status(200).send({
      success: false,
      error: 'No user found!',
      data: null
    });
  }
  const newGroup = new Group({
    groupName: groupName,
    users: idList
  })
  await newGroup.save();

  usernames.forEach(async (_user) => {
    const user = await User.findOne({ username: _user });
    if (user) {
      user.groups.push(newGroup._id);
      await user.save();
    }
  })

  return res.status(200).send({
    success: true,
    error: null,
    data: {
      id: newGroup._id,
      groupName: groupName,
      users: nameList
    }
  });

})

api.post('/addUser', async (req, res) => {
  const { groupId, usernames } = req.body;
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(200).send({
      success: false,
      error: 'Group not found!',
      data: null
    });
  }

  let userList = []
  const users = await User.find({ username: { $in: usernames } });
  const idList = users.filter(user => !group.users.includes(user._id))
  users.forEach(async (user) => {
    if (!user.groups.includes(groupId)) {
      user.groups.push(groupId);
      await user.save();
      userList.push(user.username);
    }
  })
  group.users = group.users.concat(idList);
  console.log('users', group.users);
  await group.save();

  let result = ''
  if (userList.length === 0) {
    result = `No user is added to group ${group.groupName}`
  } else if (userList.length === 1) {
    result = `User ${userList[0]} is added to group ${group.groupName}`
  } else {
    result = `User ${userList.join(', ')} are added to group ${group.groupName}`
  }
  return res.status(200).send({
    success: true,
    error: null,
    data: result
  });
})

api.post('/removeUser', async (req, res) => {
  const { groupId, usernames } = req.body;
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(200).send({
      success: false,
      error: 'Group not found!',
      data: null
    });
  }
  const users = await User.find({ username: { $in: usernames } });
  const idList = users.map(user => String(user._id));
  const nameList = users.map(user => user.username);
  if (idList.length === 0) {
    return res.status(200).send({
      success: false,
      error: 'User all not found!',
      data: null
    });
  }
  group.users = group.users.filter(id => !idList.includes(String(id)));
  await group.save();
  let result = '';
  if (nameList.length === 1) {
    result = `User ${nameList[0]} is removed from group!`
  }
  else {
    result = `User ${nameList.join(', ')} are removed from group!`
  }
  return res.status(200).send({
    success: true,
    error: null,
    data: result
  });
})

export default api;