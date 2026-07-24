import { vi } from 'vitest'

// JSDOM 缺少 IntersectionObserver，添加桩实现
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.scrollTo = vi.fn()
