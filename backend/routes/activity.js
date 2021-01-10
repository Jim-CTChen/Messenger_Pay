import { Activity, User, Balance } from '../model/models'
import handleMissing from './utility'
const express = require("express");
const api = express.Router();

api.get('/', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    const activities = await Activity
      .find()
      .populate('creditor', 'name')
      .populate('debtor', 'name')
      .sort({ timestamp: 'desc' });
    return res.status(200).send({
      success: true,
      error: null,
      data: activities
    })
  }
  else {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(200).send({
        success: false,
        error: `User ${username} not found!`,
        data: null
      });
    }
    const activities = await Activity
      .find({ $or: [{ creditor: user._id }, { debtor: user._id }] })
      .populate('creditor', 'name')
      .populate('debtor', 'name')
      .sort({ timestamp: 'desc' });
    return res.status(200).send({
      success: true,
      error: null,
      data: activities
    })
  }
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
  const { creditor, debtor, amount, description } = req.body;
  if (creditor === debtor) {
    return res.status(200).send({
      success: false,
      error: 'Creditor & debtor are the same!',
      data: null
    });
  }
  const creditorUser = await User
    .findOne({ username: creditor });
  // .populate('friends.friend', 'name');
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
      balance: Number(amount)
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
    description: description
  });
  await newActivity.save();
  return res.status(200).send({
    success: true,
    error: null,
    data: newActivity
  });
})

export default api;