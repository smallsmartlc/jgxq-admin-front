import request from '@/utils/request'

export function pageTeams(cur,size,params) {
  return request({
    url: `team/page/${cur}/${size}`,
    method: 'get',
    params
  })
}
export function getTeam(id) {
  return request({
    url:`team/infos/${id}`,
    method : 'get',
  })
}
export function deleteTeam(id) {
  return request({
    url:`team/${id}`,
    method : 'delete',
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