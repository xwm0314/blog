const express = require('express')
const router = express.Router()
const statsController = require('../controllers/statsController')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, statsController.getStats)
router.get('/trend', authMiddleware, statsController.getArticleTrend)
router.get('/tags', authMiddleware, statsController.getTagStats)
router.get('/recent', authMiddleware, statsController.getRecentArticles)

module.exports = router
