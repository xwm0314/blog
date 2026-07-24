import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_ITEMS = [
  { id: 1, title: '开始搭建个人成长博客', date: '2026-07-01', category: '随笔', excerpt: '今天决定开始搭建自己的个人成长博客，记录学习与生活中的点滴。' },
  { id: 2, title: 'Vue3 组合式 API 学习笔记', date: '2026-07-03', category: '学习', excerpt: 'Composition API 让逻辑复用变得优雅，ref / reactive / watchEffect 的使用场景。' },
  { id: 3, title: '七月第一周总结', date: '2026-07-05', category: '随笔', excerpt: '这一周主要完成了前端脚手架的搭建，学习了 SCSS 变量管理和 Element Plus 主题定制。' },
  { id: 4, title: 'Node.js 中间件机制', date: '2026-07-06', category: '技术', excerpt: 'Express 中间件的洋葱圈模型、错误处理中间件的编写、JWT 鉴权实现思路。' },
  { id: 5, title: 'MongoDB 数据建模', date: '2026-07-08', category: '技术', excerpt: '博客系统的数据模型设计：文章、标签、留言、站点配置的关系梳理与索引优化。' },
  { id: 6, title: '周末骑行随记', date: '2026-07-10', category: '生活', excerpt: '今天沿着江边骑行了 30 公里，天气很好，沿途的风景让人心情舒畅。' },
  { id: 7, title: '三栏布局设计思路', date: '2026-07-11', category: '随笔', excerpt: '借鉴优秀个人博客设计，最终选择了左侧固定导航、中间滚动内容、右侧日历的三栏布局。' },
  { id: 8, title: 'CSS Grid 布局实践', date: '2026-07-12', category: '技术', excerpt: 'Grid 布局让二维排版变得简单，grid-template-areas 的命名区域方式非常直观。' },
  { id: 9, title: '读《暗时间》有感', date: '2026-07-13', category: '随笔', excerpt: '善于利用思维时间的人，可以无形中比别人多出很多时间，实际投入是时间与效率的乘积。' },
  { id: 10, title: 'JavaScript 异步编程', date: '2026-07-14', category: '学习', excerpt: '从回调函数到 Promise 再到 async/await，JavaScript 的异步解决方案不断进化。' },
  { id: 11, title: '周末电影推荐', date: '2026-07-15', category: '生活', excerpt: '本周推荐《白日梦想家》，一部关于勇气与冒险的治愈系电影。' },
  { id: 12, title: 'Docker 入门指南', date: '2026-07-17', category: '技术', excerpt: 'Docker 解决了"在我机器上能跑"的问题，通过容器化实现环境一致性。' },
  { id: 13, title: '设计模式学习笔记', date: '2026-07-18', category: '学习', excerpt: '单例模式、工厂模式、观察者模式是前端开发中最常用的三种设计模式。' },
  { id: 14, title: '七月读书清单', date: '2026-07-19', category: '随笔', excerpt: '本月读完《重构》《代码整洁之道》《深入理解计算机系统》三本书。' },
  { id: 15, title: 'TypeScript 类型体操', date: '2026-07-20', category: '技术', excerpt: '条件类型、映射类型、模板字面量类型是 TypeScript 高级类型的基础。' },
  { id: 16, title: '晨跑打卡记录', date: '2026-07-22', category: '生活', excerpt: '坚持晨跑两周了，每天 5 公里，精神状态明显好了很多。' },
  { id: 17, title: 'HTTP 缓存机制总结', date: '2026-07-23', category: '学习', excerpt: '强缓存与协商缓存的区别、Expires/Cache-Control/ETag 的使用场景。' },
  { id: 18, title: '摄影入门心得', date: '2026-07-25', category: '生活', excerpt: '入手了第一台微单，光圈优先模式是新手最友好的拍摄模式。' },
  { id: 19, title: 'React vs Vue 对比', date: '2026-07-27', category: '技术', excerpt: '两者都是优秀的框架，Vue 的上手曲线更平缓，React 的生态更丰富。' },
  { id: 20, title: '七月月度总结', date: '2026-07-29', category: '随笔', excerpt: '七月关键词：搭建博客、学习新技术、坚持运动。期待八月。' }
]

export const useContentStore = defineStore('content', () => {
  const items = ref([])

  function load() {
    try {
      const raw = localStorage.getItem('blog_content_items')
      if (raw) {
        items.value = JSON.parse(raw)
        return
      }
    } catch (e) {}
    items.value = DEFAULT_ITEMS.map((i) => ({ ...i }))
  }

  function save() {
    localStorage.setItem('blog_content_items', JSON.stringify(items.value))
  }

  function add(item) {
    const newItem = {
      ...item,
      id: Date.now(),
      date: item.date || new Date().toISOString().slice(0, 10)
    }
    items.value.push(newItem)
    save()
    return newItem
  }

  function remove(id) {
    items.value = items.value.filter((i) => i.id !== id)
    save()
  }

  function update(id, data) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...data }
      save()
    }
  }

  function reset() {
    localStorage.removeItem('blog_content_items')
    items.value = DEFAULT_ITEMS.map((i) => ({ ...i }))
  }

  load()

  return { items, add, remove, update, reset, load }
})
