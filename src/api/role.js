import request from '@/utils/request'

export function listBasicRole() {
  return request({
    url: `/role/list`,
    method: 'get'
  })
}
