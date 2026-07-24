import request from '@/utils/request'

export function getStats() {
  return request({
    url: '/stats',
    method: 'get'
  })
}

export function getArticleTrend(params) {
  return request({
    url: '/stats/trend',
    method: 'get',
    params
  })
}

export function getTagStats() {
  return request({
    url: '/stats/tags',
    method: 'get'
  })
}

export function getRecentArticles() {
  return request({
    url: '/stats/recent',
    method: 'get'
  })
}
