const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articleController')
const authMiddleware = require('../middleware/auth')

// 公开接口
router.get('/published', articleController.getPublishedList)
router.get('/published/:id', articleController.getDetail)

// 管理接口（需登录）
router.get('/', authMiddleware, articleController.getAll)
router.post('/', authMiddleware, articleController.create)
router.put('/:id', authMiddleware, articleController.update)
router.delete('/:id', authMiddleware, articleController.remove)

module.exports = router
