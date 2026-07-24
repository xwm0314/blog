const config = require('../config')

/**
 * 全局异常处理中间件
 */
function errorHandler(err, req, res, next) {
  console.error('[Error]', err)

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({ code: -1, message: '数据验证失败', data: err.message })
  }

  // Mongoose CastError (无效 ID)
  if (err.name === 'CastError') {
    return res.status(400).json({ code: -1, message: '资源不存在', data: null })
  }

  // Multer 文件上传错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ code: -1, message: '文件大小超出限制', data: null })
  }

  const status = err.status || 500
  const message = err.message || '服务器内部错误'
  res.status(status).json({
    code: status === 401 ? 401 : -1,
    message,
    data: config.nodeEnv === 'development' ? err.stack : null
  })
}

module.exports = errorHandler
