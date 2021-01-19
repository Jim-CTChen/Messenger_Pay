const express = require("express");
const api = express.Router();

const jwt = require("jsonwebtoken");
const jwtKey = "messengerPayJwtKey";

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

export default api;