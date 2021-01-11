import { Activity, User, Balance } from '../model/models'
import handleMissing from './utility'
import { ACTIVITY_TYPE } from '../constants/enum'
const express = require("express");
const api = express.Router();

api.get('/all', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    const activities = await Activity
      .find({}, { '_id': 0, '__v': 0 })
      .populate('creditor', 'name -_id')
      .populate('debtor', 'name -_id')
      .sort({ timestamp: 'desc' });
    return res.status(200).send({
      success: true,
      error: null,
      data: activities
    })
  }
  else {
    const user = await User
      .findOne({ username: username });
    if (!user) {
      return res.status(200).send({
        success: false,
        error: `User ${username} not found!`,
        data: null
      });
    }
    const activities = await Activity
      .find({ $or: [{ creditor: user._id }, { debtor: user._id }] }, { '_id': 0, '__v': 0 })
      .populate('creditor', 'name -_id')
      .populate('debtor', 'name -_id')
      .sort({ timestamp: 'desc' });
    return res.status(200).send({
      success: true,
      error: null,
      data: activities
    })
  }
})

api.get('/friend', async (req, res) => {
  const requiredList = ['username', 'friendName'];
  let missing = handleMissing(requiredList, req.query);
  if (missing) {
    return res.status(200).send({
      success: false,
      error: missing,
      data: null
    });
  }
  const { username, friendName } = req.query;
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(200).send({
      success: false,
      error: `User ${username} not found!`,
      data: null
    });
  }
  const friend = await User.findOne({ username: friendName });
  if (!friend) {
    return res.status(200).send({
      success: false,
      error: `User ${friendName} not found!`,
      data: null
    });
  }
  const activities = await Activity
    .find({ $or: [{ creditor: user._id }, { debtor: user._id }] }, { '_id': 0, '__v': 0 })
    .find({ $or: [{ creditor: friend._id }, { debtor: friend._id }] }, { '_id': 0, '__v': 0 })
    .populate('creditor', 'name -_id')
    .populate('debtor', 'name -_id')
    .sort({ timestamp: 'desc' });
  const activityList = activities.map(ele => {
    let amount = 0;
    if (ele.debtor.name === username) amount = -ele.amount;
    else amount = ele.amount;
    return {
      amount: amount,
      description: ele.description,
      time: ele.timestamp,
      type: ele.type,
    }
  })
  return res.status(200).send({
    success: true,
    error: null,
    data: activityList
  })
})

api.post('/', async (req, res) => {
  const requiredList = ['creditor', 'debtor', 'amount'];
  let missing = handleMissing(requiredList, req.body);
  if (missing) {
    return res.status(200).send({
      success: false,
      error: missing,
      data: null
    });
  }
  const { creditor, debtor, amount, description, type } = req.body;
  if (creditor === debtor) {
    return res.status(200).send({
      success: false,
      error: 'Creditor & debtor are the same!',
      data: null
    });
  }
  const creditorUser = await User
    .findOne({ username: creditor });
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

  // handle sync balance
  const friend1 = creditorUser.friends.find(ele =>
    String(ele.friend) === String(debtorUser._id)
  );
  const friend2 = debtorUser.friends.find(ele =>
    String(ele.friend) === String(creditorUser._id)
  );
  if (!friend1 && !friend2) { // not created

    let newBalance = new Balance({
      user1: creditorUser._id,
      user2: debtorUser._id,
      balance1to2: Number(amount)
    });
    creditorUser.friends.push({
      friend: debtorUser._id,
      balance: newBalance._id,
    });
    debtorUser.friends.push({
      friend: creditorUser._id,
      balance: newBalance._id
    });
    newBalance.save();
    creditorUser.save();
    debtorUser.save();
  }
  else if (!friend1) { // missing add to creditor
    const balanceId = friend2.balance;
    const balance = await Balance.findById(balanceId);
    if (!balance) console.log('ERROR!!!');
    if (String(balance.user1) === (creditorUser._id)) {
      balance.balance1to2 = Number(balance.balance1to2) + Number(amount);
    }
    else balance.balance1to2 = Number(balance.balance1to2) - Number(amount);
    balance.save();
    creditorUser.friends.push({
      friend: debtorUser._id,
      balance: balanceId,
    });
  }
  else if (!friend2) { // missing add to debtor
    const balanceId = friend1.balance;
    const balance = await Balance.findById(balanceId);
    if (!balance) console.log('ERROR!!!');
    if (String(balance.user1) === String(creditorUser._id)) {
      balance.balance1to2 = Number(balance.balance1to2) + Number(amount);
    }
    else balance.balance1to2 = Number(balance.balance1to2) - Number(amount);
    balance.save();
    debtorUser.friends.push({
      friend: creditorUser._id,
      balance: balanceId,
    });
  }
  else { // balance already exist
    const balanceId = friend1.balance;
    const balance = await Balance.findById(balanceId);
    if (!balance) console.log('ERROR!!');
    if (String(balance.user1) === String(creditorUser._id)) {
      balance.balance1to2 = Number(balance.balance1to2) + Number(amount);
    }
    else balance.balance1to2 = Number(balance.balance1to2) - Number(amount);
    balance.save();
  }

  // add activity
  const newActivity = new Activity({
    creditor: creditorUser._id,
    debtor: debtorUser._id,
    amount: Number(amount),
    description: description,
    type: (ACTIVITY_TYPE.includes(type)) ? type : 'PERSONAL'
  });
  await newActivity.save();
  return res.status(200).send({
    success: true,
    error: null,
    data: newActivity
  });
})

export default api;