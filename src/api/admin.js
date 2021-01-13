import request from '@/utils/request'

export function pageAdmin(cur,size) {
  return request({
    url: `/admin/page/${cur}/${size}`,
    method: 'get'
  })
}
