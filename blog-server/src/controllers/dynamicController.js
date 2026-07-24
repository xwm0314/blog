﻿const jsonDb = require('../utils/jsonDb')

exports.createDynamic = async (req, res, next) => {
  try {
    const { content, images } = req.body

    if (!content && (!images || images.length === 0)) {
      return res.fail('内容不能为空')
    }

    const dynamic = jsonDb.create('dynamics', {
      content: content || '',
      images: images || []
    })
    res.success(dynamic, '发布成功')
  } catch (err) {
    next(err)
  }
}

exports.getDynamics = async (req, res, next) => {
  try {
    let dynamics = jsonDb.readFile('dynamics')
    dynamics = dynamics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const start = (page - 1) * limit
    const end = start + limit

    const total = dynamics.length
    const list = dynamics.slice(start, end)

    res.success({ list, total, page, limit }, '获取成功')
  } catch (err) {
    next(err)
  }
}

exports.getDynamicById = async (req, res, next) => {
  try {
    const dynamic = jsonDb.findById('dynamics', req.params.id)
    if (!dynamic) {
      return res.fail('动态不存在')
    }
    res.success({ dynamic }, '获取成功')
  } catch (err) {
    next(err)
  }
}

exports.deleteDynamic = async (req, res, next) => {
  try {
    const result = jsonDb.remove('dynamics', req.params.id)
    if (!result) {
      return res.fail('动态不存在')
    }
    res.success(null, '删除成功')
  } catch (err) {
    next(err)
  }
}
