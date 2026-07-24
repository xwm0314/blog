const mongoose = require('mongoose')

const siteConfigSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      default: '昵称'
    },
    slogan: {
      type: String,
      default: '记录成长，遇见更好的自己'
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    skills: [
      {
        name: { type: String },
        level: { type: Number, min: 0, max: 100 }
      }
    ],
    social: {
      github: { type: String, default: '' },
      email: { type: String, default: '' },
      wechat: { type: String, default: '' }
    }
  },
  { timestamps: true }
)

// 确保只有一条配置记录
siteConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne()
  if (!config) {
    config = await this.create({})
  }
  return config
}

module.exports = mongoose.model('SiteConfig', siteConfigSchema)
