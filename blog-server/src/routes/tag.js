const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tagController')
const authMiddleware = require('../middleware/auth')

// 公开：获取所有标签
router.get('/', tagController.getAll)
// 管理接口
router.post('/', authMiddleware, tagController.create)
router.put('/:id', authMiddleware, tagController.update)
router.delete('/:id', authMiddleware, tagController.remove)

module.exports = router
