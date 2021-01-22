import request from '@/utils/request'

export const pageMatches = (pageNum,pageSize) => request({
    method: 'get',
    url: `/match/page`,
    params :{
        pageNum,
        pageSize
    } 
})
export const getMatchById = (id) => request({
    method: 'get',
    url: `/match/${id}`,
})
export const deleteMatchById = (id) => request({
    method: 'delete',
    url: `/match/${id}`,
})
export const addMatch = (data) => request({
    method: 'post',
    url: `/match`,
    data 
})
export const updateMatch = (id,data) => request({
    method: 'put',
    url: `/match/${id}`,
    data 
})