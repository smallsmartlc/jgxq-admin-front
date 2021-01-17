import request from '@/utils/request'

export function pageAdmin(cur,size) {
  return request({
    url: `/admin/page/${cur}/${size}`,
    method: 'get'
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
export function deleteAdmin(adminKey) {
  return request({
    url : `/admin/${adminKey}`,
    method : 'delete',
  })
}
export function resetPassword(adminKey,password) {
  return request({
    url : `/admin/resetPwd`,
    method : 'put',
    data : {adminKey,password}
  })
}