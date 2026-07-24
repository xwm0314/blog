import request from '@/utils/request'

export function getSiteConfig() {
  return request({
    url: '/config',
    method: 'get'
  })
}

export function updateSiteConfig(data) {
  return request({
    url: '/config',
    method: 'put',
    data
  })
}
