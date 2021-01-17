import request from '@/utils/request'

export function listBasicRole() {
  return request({
    url: `/role/list`,
    method: 'get'
  })
}
export function getRoleById(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}
export function listPermissions() {
  return request({
    url : `/permission/list`,
    method : 'get'
  })
}
export function addRole(data) {
  return request({
    url : `/role`,
    method : 'post',
    data
  })
}
export function deleteRole(id) {
  return request({
    url : `/role/${id}`,
    method : 'delete',
  })
}
export function editRole(data) {
  return request({
    url : `/role/${data.id}`,
    method : 'put',
    data
  })
}