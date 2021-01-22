import request from '@/utils/request'

export function pageTalk(cur,size) {
    return request({
        url: `talk/page/${cur}/${size}`,
        method: 'get'
    })
}
export function deleteTalk(id) {
    return request({
        method : 'delete',
        url:`talk/${id}`,
    })
}
export function getNewsTalk(id) {
    return request({
        method : 'get',
        url:`talk/${id}`
    })
}