const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')
const authMiddleware = require('../middleware/auth')

// 公开：获取可见留言 & 创建留言
router.get('/', messageController.getVisibleList)
router.post('/', messageController.create)

// 管理接口
router.get('/all', authMiddleware, messageController.getAll)
router.put('/:id/read', authMiddleware, messageController.markRead)
router.delete('/:id', authMiddleware, messageController.remove)

module.exports = router
