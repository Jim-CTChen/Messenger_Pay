const express = require("express");
const api = express.Router();

const jwt = require("jsonwebtoken");
const jwtKey = "messengerPayJwtKey";
const jwtExpirySeconds = 60 * 60 * 24;

import { User } from '../model/models'
import handleMissing from '../middleware/utility'
import requirement from '../middleware/require'

api.use((req, res, next) => { // check required 
  const requiredList = requirement.auth[`${req.method}`][`${req.path}`];
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
  let payload;
  if (!req.headers.token) {
    return res.status(401).end();
  }

  console.log('given token', req.headers.token);
  try {
    payload = jwt.verify(req.headers.token, jwtKey);
    console.log('payload', payload);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }
  return res.status(200).send({
    success: true,
    error: null,
    data: {
      username: payload.username
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
  const token = jwt.sign({ username, password }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  })

  res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
  return res.status(200).send({
    success: true,
    error: null,
    data: token
  });
});

export default api;