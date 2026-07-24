const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const authMiddleware = require('../middleware/auth')
const upload = require('../utils/upload')

// 图片上传（需登录）
router.post('/', authMiddleware, upload.single('file'), uploadController.uploadImage)

module.exports = router
