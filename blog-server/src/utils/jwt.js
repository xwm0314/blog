const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * 生成 JWT Token
 * @param {object} payload - { id, username, role }
 * @returns {string} token
 */
function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  })
}

/**
 * 验证 JWT Token
 * @param {string} token
 * @returns {object|null} decoded payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch {
    return null
  }
}

module.exports = { generateToken, verifyToken }
