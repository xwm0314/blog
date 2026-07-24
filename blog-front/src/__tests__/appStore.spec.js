import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/app'

describe('appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初始封面可见', () => {
    const store = useAppStore()
    expect(store.isCoverVisible).toBe(true)
  })

  it('setCoverVisible 切换封面状态', () => {
    const store = useAppStore()
    store.setCoverVisible(false)
    expect(store.isCoverVisible).toBe(false)
    store.setCoverVisible(true)
    expect(store.isCoverVisible).toBe(true)
  })

  it('setSiteConfig 合并默认配置', () => {
    const store = useAppStore()
    store.setSiteConfig({ nickname: '测试昵称', slogan: '测试标语' })
    expect(store.siteConfig.nickname).toBe('测试昵称')
    expect(store.siteConfig.slogan).toBe('测试标语')
    expect(store.siteConfig.bio).toBe('') // 应保留默认值
  })
})
