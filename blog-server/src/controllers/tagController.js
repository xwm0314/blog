const jsonDb = require('../utils/jsonDb')

exports.getAll = async (req, res, next) => {
  try {
    let tags = jsonDb.readFile('tags')
    tags.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.success({ list: tags })
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    const { name, color, description } = req.body
    const tags = jsonDb.readFile('tags')
    const existing = tags.find(t => t.name === name)
    if (existing) return res.fail('标签名已存在')
    const tag = jsonDb.create('tags', { name, color, description })
    res.success({ tag }, '标签创建成功')
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    const tag = jsonDb.update('tags', req.params.id, req.body)
    if (!tag) return res.fail('标签不存在')
    res.success({ tag }, '标签更新成功')
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    const success = jsonDb.remove('tags', req.params.id)
    if (!success) return res.fail('标签不存在')
    res.success(null, '标签删除成功')
  } catch (err) { next(err) }
}