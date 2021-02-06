import request from '@/utils/request'

export function pageNews(cur,size,keyword) {
    return request({
        url: `news/page/${cur}/${size}`,
        method: 'get',
        params : {keyword}
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
export function searchNews(keyword) {
    return request({
        method : 'get',
        url:`news/search`,
        params : {keyword}
    })
}
export function listTopNews() {
    return request({
        method : 'get',
        url:`news/top`,
    })
}
export function addTopNews(id) {
    return request({
        method : 'post',
        url:`news/top/${id}`,
    })
}
export function deleteTopNews(id) {
    return request({
        method : 'delete',
        url:`news/top/${id}`,
    })
}
