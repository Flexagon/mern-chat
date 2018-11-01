require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const io = require('socket.io');
const cors = require('cors');

const user = require('./routes/api/user');
const conversation = require('./routes/api/conversation');
const socketEvents = require('./socketEvents');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = process.env.MONGO_URI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/user', user);
app.use('/api/chat', conversation);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

socketEvents(io.listen(server));
