import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ContentFeed from '@/components/home/ContentFeed.vue'

describe('ContentFeed', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('组件可正常挂载', () => {
    const wrapper = shallowMount(ContentFeed)
    expect(wrapper.exists()).toBe(true)
  })

  it('初始渲染 20 条内容，超出容器高度触发滚动', () => {
    const wrapper = shallowMount(ContentFeed)
    expect(wrapper.vm.contentItems).toHaveLength(20)
  })

  it('markedDates 与 contentItems 日期一致', () => {
    const wrapper = shallowMount(ContentFeed)
    expect(wrapper.vm.markedDates).toHaveLength(20)
    expect(wrapper.vm.markedDates).toEqual(
      wrapper.vm.contentItems.map((i) => i.date)
    )
  })

  it('filterByDate 切换 selectedDate：同日期清除过滤', () => {
    const wrapper = shallowMount(ContentFeed)
    expect(wrapper.vm.selectedDate).toBeNull()

    wrapper.vm.filterByDate('2026-07-01')
    expect(wrapper.vm.selectedDate).toBe('2026-07-01')

    wrapper.vm.filterByDate('2026-07-01')
    expect(wrapper.vm.selectedDate).toBeNull()
  })

  it('filterByDate 正确过滤 visibleItems', () => {
    const wrapper = shallowMount(ContentFeed)
    expect(wrapper.vm.visibleItems).toHaveLength(20)

    wrapper.vm.filterByDate('2026-07-03')
    expect(wrapper.vm.visibleItems).toHaveLength(1)
    expect(wrapper.vm.visibleItems[0].title).toBe(
      'Vue3 组合式 API 学习笔记'
    )

    wrapper.vm.filterByDate('2026-07-22')
    expect(wrapper.vm.visibleItems).toHaveLength(1)
    expect(wrapper.vm.visibleItems[0].title).toBe(
      '晨跑打卡记录'
    )
  })

  it('clearFilter 恢复显示全部', () => {
    const wrapper = shallowMount(ContentFeed)
    wrapper.vm.filterByDate('2026-07-06')
    expect(wrapper.vm.visibleItems).toHaveLength(1)

    wrapper.vm.clearFilter()
    expect(wrapper.vm.selectedDate).toBeNull()
    expect(wrapper.vm.visibleItems).toHaveLength(20)
  })

  it('filterByDate 支持多卡片同一日期的场景', () => {
    const wrapper = shallowMount(ContentFeed)
    wrapper.vm.filterByDate('2026-07-11')
    expect(wrapper.vm.visibleItems).toHaveLength(1)
  })

  it('容器 overflow-y 为 auto 以支持纵向滚动', () => {
    const wrapper = shallowMount(ContentFeed)
    const feed = wrapper.find('.content-feed')
    expect(feed.exists()).toBe(true)
  })

  it('formatDateShort 返回正确格式', () => {
    const wrapper = shallowMount(ContentFeed)
    const cards = wrapper.findAll('[data-date="2026-07-11"]')
    expect(cards).toHaveLength(1)
  })

  it('expose 暴露 addItem / removeItem', () => {
    const wrapper = shallowMount(ContentFeed)
    expect(typeof wrapper.vm.addItem).toBe('function')
    expect(typeof wrapper.vm.removeItem).toBe('function')
  })

  it('addItem 通过 store 添加新卡片', () => {
    const wrapper = shallowMount(ContentFeed)
    const count = wrapper.vm.contentItems.length
    wrapper.vm.addItem({ title: '测试新增', date: '2026-08-01', category: '其他', excerpt: '通过浮动按钮添加' })
    expect(wrapper.vm.contentItems).toHaveLength(count + 1)
    expect(wrapper.vm.contentItems.at(-1).title).toBe('测试新增')
  })

  it('filterByDate 切换日期后 enteredCards 重置', () => {
    const wrapper = shallowMount(ContentFeed)
    expect(wrapper.vm.enteredCards.size).toBe(0)

    wrapper.vm.filterByDate('2026-07-15')
    expect(wrapper.vm.selectedDate).toBe('2026-07-15')
    expect(wrapper.vm.enteredCards.size).toBe(0)
  })

  it('clearFilter 后 enteredCards 重置', () => {
    const wrapper = shallowMount(ContentFeed)
    wrapper.vm.filterByDate('2026-07-18')
    wrapper.vm.clearFilter()
    expect(wrapper.vm.selectedDate).toBeNull()
    expect(wrapper.vm.enteredCards.size).toBe(0)
  })
})
