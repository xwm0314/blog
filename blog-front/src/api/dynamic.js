import request from '@/utils/request'

export function getDynamicList(params) {
  return request({
    url: '/dynamics',
    method: 'get',
    params
  })
}

export function getPublishedDynamics(params) {
  return request({
    url: '/dynamics/published',
    method: 'get',
    params
  })
}

export function getPublishedDynamicDetail(id) {
  return request({
    url: `/dynamics/published/${id}`,
    method: 'get'
  })
}

export function getDynamicDetail(id) {
  return request({
    url: `/dynamics/${id}`,
    method: 'get'
  })
}

export function createDynamic(data) {
  return request({
    url: '/dynamics',
    method: 'post',
    data
  })
}

export function deleteDynamic(id) {
  return request({
    url: `/dynamics/${id}`,
    method: 'delete'
  })
}
