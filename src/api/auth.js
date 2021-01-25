import request from '@/utils/request'

export function resetPassword(data) {
    return request({
      url : `check/resetPwd`,
      method : 'put',
      data
    }) 
  }