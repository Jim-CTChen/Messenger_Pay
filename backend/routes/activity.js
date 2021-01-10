import { Activity, User } from '../model/models'
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
      data: mull
    });
  }
  const { creditor, debtor, amount, description } = req.body;
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
  const newActivity = new Activity({
    creditor: creditorUser._id,
    debtor: debtorUser._id,
    amount: amount,
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