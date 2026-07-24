const fs = require('fs')
const path = require('path')

const dataDir = path.resolve(__dirname, '../../data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

function getFilePath(fileName) {
  return path.join(dataDir, `${fileName}.json`)
}

function readFile(fileName) {
  const filePath = getFilePath(fileName)
  if (!fs.existsSync(filePath)) {
    return []
  }
  let content = fs.readFileSync(filePath, 'utf-8')
  content = content.replace(/^\uFEFF+/, '')
  try {
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeFile(fileName, data) {
  const filePath = getFilePath(fileName)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

module.exports = {
  readFile,
  writeFile,
  generateId,

  findById(fileName, id) {
    const data = readFile(fileName)
    return data.find(item => item._id === id || item.id === id)
  },

  create(fileName, data) {
    const items = readFile(fileName)
    const newItem = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    items.push(newItem)
    writeFile(fileName, items)
    return newItem
  },

  update(fileName, id, data) {
    const items = readFile(fileName)
    const index = items.findIndex(item => item._id === id || item.id === id)
    if (index === -1) return null
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    writeFile(fileName, items)
    return items[index]
  },

  remove(fileName, id) {
    const items = readFile(fileName)
    const index = items.findIndex(item => item._id === id || item.id === id)
    if (index === -1) return false
    items.splice(index, 1)
    writeFile(fileName, items)
    return true
  },

  find(fileName, query = {}) {
    const items = readFile(fileName)
    return items.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false
      }
      return true
    })
  },

  findOne(fileName, query = {}) {
    const items = readFile(fileName)
    return items.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false
      }
      return true
    })
  },

  increment(fileName, id, field, value = 1) {
    const items = readFile(fileName)
    const index = items.findIndex(item => item._id === id || item.id === id)
    if (index === -1) return null
    items[index][field] = (items[index][field] || 0) + value
    items[index].updatedAt = new Date().toISOString()
    writeFile(fileName, items)
    return items[index]
  }
}