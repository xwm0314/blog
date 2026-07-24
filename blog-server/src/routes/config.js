const express = require('express')
const router = express.Router()
const configController = require('../controllers/configController')
const authMiddleware = require('../middleware/auth')

// 公开：获取站点配置
router.get('/', configController.getConfig)
// 管理：更新配置
router.put('/', authMiddleware, configController.updateConfig)

module.exports = router
