import request from '@/utils/request'

export function PageTeams(cur,size,data) {
  return request({
    url: `team/page/${cur}/${size}`,
    method: 'get',
    data
  })
}
export function getTeam(id) {
  return request({
    url:`team/infos/${id}`,
    method : 'get',
  })
}
export function updateTeam(id,data) {
  return request({
    method : 'put',
    url:`team/${id}`,
    data
  })
}
export function addTeam(data) {
  return request({
    method : 'post',
    url:`team`,
    data
  })
}