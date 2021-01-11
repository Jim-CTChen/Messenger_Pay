const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const GroupSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'id field is required.']
  },
  name: {
    type: String,
    required: [true, 'name field is required.']
  },
  users: [{
    type: Schema.Types.ObjectId, ref: "user"
  }],
  activities: [{
    type: Schema.Types.ObjectId, ref: "activity"
  }]
})

// Creating a table within database with the defined schema
const Group = mongoose.model('group', GroupSchema)

// Exporting table for querying and mutating
module.exports = { Group }
