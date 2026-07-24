const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * JWT 鉴权中间件
 * 从 Authorization header 中提取 Bearer token 并验证
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证令牌', data: null })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.admin = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 401, message: '令牌已过期', data: null })
    }
    return res.status(401).json({ code: 401, message: '无效的认证令牌', data: null })
  }
}

module.exports = authMiddleware
