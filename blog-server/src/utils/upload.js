const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// 使用 Cloudinary 存储
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    public_id: (req, file) => {
      const ext = path.extname(file.originalname)
      return Date.now() + '-' + Math.round(Math.random() * 1e9) + ext
    }
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i
  if (allowed.test(path.extname(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('不支持的图片格式'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

module.exports = upload
