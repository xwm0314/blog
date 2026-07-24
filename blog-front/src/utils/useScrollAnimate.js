// ========================================
// 滚动入场动画组合函数
// ========================================

/**
 * 使用 IntersectionObserver 监听单个元素进入视口，添加 .visible 类
 */
export function useScrollAnimate(el, options = {}) {
  if (!el) return
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = options
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    },
    { threshold, rootMargin }
  )
  observer.observe(el)
}

/**
 * 批量注册容器内所有 .scroll-animate 子元素的滚动动画
 */
export function useScrollAnimateAll(containerRef) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  )
  if (containerRef.value) {
    const children = containerRef.value.querySelectorAll('.scroll-animate')
    children.forEach((child) => observer.observe(child))
  }
  return observer
}
