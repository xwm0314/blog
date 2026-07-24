const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 20
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    nickname: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'super'],
      default: 'admin'
    }
  },
  { timestamps: true }
)

// 保存前加密密码
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// 实例方法：校验密码
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// 返回时移除密码字段
adminSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('Admin', adminSchema)
