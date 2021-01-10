const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'username field is required.'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password field is required.']
  },
  name: {
    type: String,
    required: [true, 'name field is required.']
  },
  friends: [{
    type: Schema.Types.ObjectId, ref: "user"
  }],
  groups: [{
    type: Schema.Types.ObjectId, ref: "group"
  }]
})

// Creating a table within database with the defined schema
const User = mongoose.model('user', UserSchema)

// Exporting table for querying and mutating
module.exports = { User }
