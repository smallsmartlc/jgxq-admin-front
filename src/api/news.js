import request from '@/utils/request'

export function pageNews(cur,size) {
    return request({
        url: `news/page/${cur}/${size}`,
        method: 'get'
    })
}
export function deleteNews(id) {
    return request({
        method : 'delete',
        url:`news/${id}`,
    })
}
export function updateNews(id,data) {
    return request({
        method : 'put',
        url:`news/${id}`,
        data
    })
}
export function getNewsById(id) {
    return request({
        method : 'get',
        url:`news/${id}`
    })
}