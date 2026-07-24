const jsonDb = require('../utils/jsonDb')

exports.getPublishedList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tag, category } = req.query
    let articles = jsonDb.readFile('articles')
    articles = articles.filter(a => a.status === 'published')
    if (tag) articles = articles.filter(a => a.tags?.includes(tag))
    if (category) articles = articles.filter(a => a.category === category)
    const tags = jsonDb.readFile('tags')
    articles = articles.map(a => ({
      ...a,
      tags: a.tags?.map(tid => {
        const tag = tags.find(t => t._id === tid)
        return tag ? tag.name : tid
      }) || []
    }))
    articles.sort((a, b) => {
      if (a.isTop !== b.isTop) return b.isTop ? 1 : -1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    const start = (page - 1) * limit
    const end = start + Number(limit)
    const list = articles.slice(start, end)
    res.success({ list, total: articles.length, page: Number(page), limit: Number(limit) })
  } catch (err) { next(err) }
}

exports.getDetail = async (req, res, next) => {
  try {
    let article = jsonDb.findById('articles', req.params.id)
    if (!article) return res.fail('文章不存在')
    const tags = jsonDb.readFile('tags')
    article = {
      ...article,
      tags: article.tags?.map(tid => {
        const tag = tags.find(t => t._id === tid)
        return tag ? tag.name : tid
      }) || []
    }
    jsonDb.increment('articles', req.params.id, 'views', 1)
    res.success({ article })
  } catch (err) { next(err) }
}

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    let articles = jsonDb.readFile('articles')
    if (status) articles = articles.filter(a => a.status === status)
    const tags = jsonDb.readFile('tags')
    articles = articles.map(a => ({
      ...a,
      tags: a.tags?.map(tid => {
        const tag = tags.find(t => t._id === tid)
        return tag ? tag.name : tid
      }) || []
    }))
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const start = (page - 1) * limit
    const end = start + Number(limit)
    const list = articles.slice(start, end)
    res.success({ list, total: articles.length, page: Number(page), limit: Number(limit) })
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    const article = jsonDb.create('articles', req.body)
    res.success({ article }, '文章创建成功')
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    const article = jsonDb.update('articles', req.params.id, req.body)
    if (!article) return res.fail('文章不存在')
    res.success({ article }, '文章更新成功')
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    const success = jsonDb.remove('articles', req.params.id)
    if (!success) return res.fail('文章不存在')
    res.success(null, '文章删除成功')
  } catch (err) { next(err) }
}