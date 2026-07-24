const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

// 登录（不需要鉴权）
router.post('/login', authController.login)
// 获取当前管理员信息（需要鉴权）
router.get('/info', authMiddleware, authController.getInfo)
// 注册（需要鉴权，仅已有管理员可创建新管理员）
router.post('/register', authMiddleware, authController.register)

module.exports = router
