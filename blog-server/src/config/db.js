const mongoose = require('mongoose')
const config = require('./index')
const jsonDb = require('../utils/jsonDb')

async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000
    })
    console.log('[MongoDB] 连接成功:', config.mongodbUri)
  } catch (err) {
    console.warn('[MongoDB] 连接失败，使用 JSON 文件存储:', err.message)
    console.log('[JSON DB] 已初始化，数据将存储在 data/ 目录')
  }
}

module.exports = connectDB