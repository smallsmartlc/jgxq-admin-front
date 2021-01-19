import request from '@/utils/request'

export function getTeamMembers(teamId) {
  return request({
    url: `player/team/${teamId}`,
    method: 'get'
  })
}
