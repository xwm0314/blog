const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 20
    },
    color: {
      type: String,
      default: '#d4839a'
    },
    description: {
      type: String,
      default: '',
      maxlength: 200
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Tag', tagSchema)
