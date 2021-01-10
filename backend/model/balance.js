const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const BalanceSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId, ref: "user",
    required: [true, 'user1 field is required.']
  },
  user2: {
    type: Schema.Types.ObjectId, ref: "user",
    required: [true, 'user2 field is required.']
  },
  balance1to2: {
    type: Number,
    default: 0
  }
})

// Creating a table within database with the defined schema
const Balance = mongoose.model('balance', BalanceSchema)

// Exporting table for querying and mutating
module.exports = { Balance }
