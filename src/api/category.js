import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-admin-template/category/list',
    method: 'get',
    params: query
  })
}

export function createCategory(params) {
  return request({
    url: '/vue-admin-template/category/add',
    method: 'post',
    params
  })
}

export function updateCategory(params) {
  return request({
    url: '/vue-admin-template/category/edit',
    method: 'post',
    params
  })
}

export function deleteCategory(id) {
  return request({
    url: '/vue-admin-template/category/delete',
    method: 'get',
    params: {id}
  })
}