import request from '@/utils/request'

export function getTeamMembers(teamId) {
  return request({
    url: `player/team/${teamId}`,
    method: 'get'
  })
}
export function getMatchTeamMembers(teamId) {
  return request({
    url: `player/match/${teamId}`,
    method: 'get'
  })
}
export function searchPlayer(keyword) {
  return request({
    url: `player/search`,
    method: 'get',
    params : {keyword}
  })
}
export function pagePlayer(cur,size,params) {
  return request({
    url: `player/page/${cur}/${size}`,
    method: 'get',
    params
  })
}
export function transfer(data) {
  return request({
    url : `player/transfer`,
    method : 'put',
    data
  })
}
export function addPlayer(data) {
  return request({
    method : 'post',
    url:`player`,
    data
  })
}
export function deletePlayer(id) {
  return request({
    method : 'delete',
    url:`player/${id}`,
  })
}
export function getPlayerById(id) {
  return request({
    method : 'get',
    url:`player/${id}`,
  })
}
export function updatePlayer(id,data) {
  return request({
    method : 'put',
    url:`player/${id}`,
    data
  })
}