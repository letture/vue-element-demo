import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/article/list',
    method: 'post',
    params
  })
}

export function createArticle(params) {
  return request({
    url: '/vue-admin-template/article/add',
    method: 'post',
    params
  })
}

export function updateArticle(params) {
  return request({
    url: '/vue-admin-template/article/edit',
    method: 'post',
    params
  })
}

export function detailArticle(id) {
  return request({
    url: '/vue-admin-template/article/detail',
    method: 'get',
    params: {id}
  })
}

export function deleteArticle(id) {
  return request({
    url: '/vue-admin-template/article/delete',
    method: 'get',
    params: {id}
  })
}