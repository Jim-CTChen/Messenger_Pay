const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const GroupSchema = new Schema({
  groupName: {
    type: String,
    required: [true, 'name field is required.']
  },
  users: [{
    type: Schema.Types.ObjectId, ref: "user"
  }],
  events: [{
    type: Schema.Types.ObjectId, ref: "event"
  }]
})

// Creating a table within database with the defined schema
const Group = mongoose.model('group', GroupSchema)

// Exporting table for querying and mutating
module.exports = { Group }
