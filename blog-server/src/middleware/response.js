/**
 * 统一返回格式中间件
 * 在 res 上挂载成功/失败响应方法
 */
function responseWrapper(req, res, next) {
  res.success = (data = null, message = '操作成功') => {
    res.json({ code: 0, message, data })
  }

  res.fail = (message = '操作失败', code = -1, data = null) => {
    res.json({ code, message, data })
  }

  next()
}

module.exports = responseWrapper
