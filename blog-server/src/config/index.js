const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

module.exports = {
  port: process.env.PORT || 3002,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog',
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: path.resolve(__dirname, '../../', process.env.UPLOAD_DIR || './uploads'),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
}
