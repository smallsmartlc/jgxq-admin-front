import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/check/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function adminReg(data){
  return request({
    url : '/admin',
    method : 'post',
    data,
  })
}

export function updateAdmin(data) {
  return request({
    url : `/admin/${data.adminKey}`,
    method : 'put',
    data,
  })
}