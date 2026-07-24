const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      default: '',
      maxlength: 500
    },
    cover: {
      type: String,
      default: ''
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    category: {
      type: String,
      enum: ['随笔', '学习', '技术', '生活', '其他'],
      default: '其他'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    views: {
      type: Number,
      default: 0
    },
    isTop: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

// 索引
articleSchema.index({ status: 1, createdAt: -1 })
articleSchema.index({ tags: 1 })

module.exports = mongoose.model('Article', articleSchema)
