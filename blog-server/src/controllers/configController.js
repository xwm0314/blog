const fs = require('fs')
const path = require('path')

const configPath = path.resolve(__dirname, '../../data/config.json')

function readConfig() {
  if (!fs.existsSync(configPath)) {
    return {
      nickname: '潇雯敏',
      slogan: '个人成长记录',
      avatar: '',
      bio: '热爱生活，热爱学习',
      sidebarComponents: []
    }
  }
  const content = fs.readFileSync(configPath, 'utf-8')
  try {
    const config = JSON.parse(content)
    if (!config.sidebarComponents) {
      config.sidebarComponents = []
    }
    return config
  } catch {
    return {
      nickname: '潇雯敏',
      slogan: '个人成长记录',
      avatar: '',
      bio: '热爱生活，热爱学习',
      sidebarComponents: []
    }
  }
}

function writeConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8')
}

exports.getConfig = async (req, res, next) => {
  try {
    const config = readConfig()
    res.success({ config })
  } catch (err) { next(err) }
}

exports.updateConfig = async (req, res, next) => {
  try {
    let config = readConfig()
    const allowedFields = ['nickname', 'slogan', 'avatar', 'bio', 'skills', 'social', 'sidebarComponents']
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) config[field] = req.body[field]
    })
    writeConfig(config)
    res.success({ config }, '配置更新成功')
  } catch (err) { next(err) }
}