const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')
const articleRoutes = require('./article')
const tagRoutes = require('./tag')
const messageRoutes = require('./message')
const uploadRoutes = require('./upload')
const configRoutes = require('./config')
const statsRoutes = require('./stats')
const dynamicRoutes = require('./dynamic')

router.use('/auth', authRoutes)
router.use('/articles', articleRoutes)
router.use('/tags', tagRoutes)
router.use('/messages', messageRoutes)
router.use('/upload', uploadRoutes)
router.use('/config', configRoutes)
router.use('/stats', statsRoutes)
router.use('/dynamics', dynamicRoutes)

module.exports = router
