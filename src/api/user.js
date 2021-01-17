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

export function pageUser(cur,size,params){
  return request({
    url : `user/page/${cur}/${size}`,
    method : 'get',
    params
  })
}
export function updateUser(userkey,data){
  return request({
    url : `user/${userkey}`,
    method : 'put',
    data
  }) 
}
export function resetPassword(userkey) {
  return request({
    url : `user/resetPwd/${userkey}`,
    method : 'put',
  }) 
}