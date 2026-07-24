const express = require('express')
const path = require('path')
const config = require('./config')
const connectDB = require('./config/db')
const corsMiddleware = require('./middleware/cors')
const responseWrapper = require('./middleware/response')
const errorHandler = require('./middleware/errorHandler')
const routes = require('./routes')

const app = express()

// ======== 中间件注册 ========

// CORS
app.use(corsMiddleware)

// JSON 与 URL-encoded 解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 统一返回格式
app.use(responseWrapper)

// ======== 静态文件服务（图片上传目录） ========
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

// ======== API 路由 ========
app.use('/api', routes)

// ======== 健康检查 ========
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ======== 404 处理 ========
app.use((req, res) => {
  res.status(404).json({ code: -1, message: '接口不存在', data: null })
})

// ======== 全局异常处理 ========
app.use(errorHandler)

async function initialize() {
  await connectDB()
}

initialize()

if (process.env.NODE_ENV !== 'production') {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[Server] 博客后端服务已启动: http://localhost:${config.port}`)
    console.log(`[Server] 外部访问地址: http://0.0.0.0:${config.port}`)
  })
}

module.exports = app
