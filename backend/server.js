const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
require('dotenv-defaults').config();

const app = express();
const port = process.env.PORT || 4000;
mongoose.set('useCreateIndex', true);

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error(error);
});

db.once('open', () => {
  console.log('MongoDB connected!');
});
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

app.use(express.static('../frontend/build'));
app.use(cors());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log('URL', req.method + ' ' + req.originalUrl);
  console.log('req body', req.body);
  console.log('req query', req.query);
  next();
});

app.get('/', (req, res) => {
  res.send('Hi, The API is at http://localhost:' + port + '/api');
});


import authRouter from './routes/auth';
import userRouter from './routes/user';
import eventRouter from './routes/event';
import groupRouter from './routes/group';

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
app.use('/api/group', groupRouter);
