const jsonDb = require('../utils/jsonDb')

exports.getVisibleList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    let messages = jsonDb.readFile('messages')
    messages = messages.filter(m => m.isVisible !== false)
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const start = (page - 1) * limit
    const end = start + Number(limit)
    const list = messages.slice(start, end)
    res.success({ list, total: messages.length, page: Number(page), limit: Number(limit) })
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    const { nickname, email, content } = req.body
    if (!nickname || !content) return res.fail('昵称和内容不能为空')
    const message = jsonDb.create('messages', { nickname, email, content, isVisible: true, isRead: false })
    res.success({ message }, '留言成功')
  } catch (err) { next(err) }
}

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    let messages = jsonDb.readFile('messages')
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const start = (page - 1) * limit
    const end = start + Number(limit)
    const list = messages.slice(start, end)
    res.success({ list, total: messages.length, page: Number(page), limit: Number(limit) })
  } catch (err) { next(err) }
}

exports.markRead = async (req, res, next) => {
  try {
    const message = jsonDb.update('messages', req.params.id, { isRead: true })
    if (!message) return res.fail('留言不存在')
    res.success({ message }, '已标记为已读')
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    const success = jsonDb.remove('messages', req.params.id)
    if (!success) return res.fail('留言不存在')
    res.success(null, '留言删除成功')
  } catch (err) { next(err) }
}