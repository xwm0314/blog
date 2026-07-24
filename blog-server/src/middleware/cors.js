const config = require('../config')

/**
 * 自定义 CORS 中间件
 */
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin

  if (config.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  next()
}

module.exports = corsMiddleware
