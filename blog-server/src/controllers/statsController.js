const jsonDb = require('../utils/jsonDb')

exports.getStats = async (req, res, next) => {
  try {
    const articles = jsonDb.readFile('articles')
    const tags = jsonDb.readFile('tags')
    const messages = jsonDb.readFile('messages')
    const dynamics = jsonDb.readFile('dynamics')
    
    const stats = {
      articleCount: articles.length,
      tagCount: tags.length,
      messageCount: messages.length,
      totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
      dynamicCount: dynamics.length
    }
    
    res.success(stats, '获取成功')
  } catch (err) {
    next(err)
  }
}

exports.getArticleTrend = async (req, res, next) => {
  try {
    const { type = 'month', days = 30 } = req.query
    const articles = jsonDb.readFile('articles')
    
    if (type === 'day') {
      const dayCount = parseInt(days) || 30
      const dayList = []
      const now = new Date()
      
      for (let i = dayCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
        const dayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        dayList.push({ day: dayStr, count: 0, views: 0 })
      }
      
      articles.forEach(article => {
        const date = new Date(article.createdAt)
        const dayStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const dayData = dayList.find(d => d.day === dayStr)
        if (dayData) {
          dayData.count++
          dayData.views += article.views || 0
        }
      })
      
      res.success({ days: dayList }, '获取成功')
    } else {
      const months = []
      const now = new Date()
      
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        months.push({ month: monthStr, count: 0, views: 0 })
      }
      
      articles.forEach(article => {
        const date = new Date(article.createdAt)
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthData = months.find(m => m.month === monthStr)
        if (monthData) {
          monthData.count++
          monthData.views += article.views || 0
        }
      })
      
      res.success({ months }, '获取成功')
    }
  } catch (err) {
    next(err)
  }
}

exports.getTagStats = async (req, res, next) => {
  try {
    const articles = jsonDb.readFile('articles')
    const tags = jsonDb.readFile('tags')
    const tagMap = {}
    tags.forEach(t => { tagMap[t._id] = t.name })
    
    const tagCount = {}
    
    articles.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach(tagId => {
          const tagName = tagMap[tagId] || tagId
          tagCount[tagName] = (tagCount[tagName] || 0) + 1
        })
      }
    })
    
    const tagList = Object.entries(tagCount)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
    
    res.success({ tags: tagList }, '获取成功')
  } catch (err) {
    next(err)
  }
}

exports.getRecentArticles = async (req, res, next) => {
  try {
    const articles = jsonDb.readFile('articles')
    const recent = articles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(a => ({
        _id: a._id,
        title: a.title,
        views: a.views || 0,
        createdAt: a.createdAt,
        category: a.category || '未分类'
      }))
    
    res.success({ list: recent }, '获取成功')
  } catch (err) {
    next(err)
  }
}
