const jsonDb = require('../utils/jsonDb')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/jwt')

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.fail('请输入用户名和密码')
    const admins = jsonDb.readFile('admins')
    const admin = admins.find(a => a.username === username)
    if (!admin) return res.fail('用户名或密码错误')
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) return res.fail('用户名或密码错误')
    const payload = { id: admin._id, username: admin.username, role: 'admin' }
    const token = generateToken(payload)
    res.success({ token, admin }, '登录成功')
  } catch (err) { next(err) }
}

exports.getInfo = async (req, res, next) => {
  try {
    const admins = jsonDb.readFile('admins')
    const admin = admins.find(a => a._id === req.admin.id)
    if (!admin) return res.fail('管理员不存在')
    res.success({ admin })
  } catch (err) { next(err) }
}

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const admins = jsonDb.readFile('admins')
    const existing = admins.find(a => a.username === username)
    if (existing) return res.fail('用户名已存在')
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = jsonDb.create('admins', { username, password: hashedPassword })
    res.success({ admin }, '注册成功')
  } catch (err) { next(err) }
}