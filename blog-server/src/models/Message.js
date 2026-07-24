const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    email: {
      type: String,
      default: '',
      maxlength: 100
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

messageSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Message', messageSchema)
