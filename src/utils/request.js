import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import * as utils from './common.js'


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
      'Content-type': 'application/json;charset=UTF-8'
  },
  retry: 4,
  retryDelay: 1000
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code != 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    let errorStr = error + ''
    if (errorStr.search('timeout') !== -1 && utils.isEmpty(error.response)) {
      // 超时处理
      let config = error.config
      let url = config.url.replace(BaseUrl, '')
      config.__retryCount = config.__retryCount || 0
      if (config.__retryCount >= config.retry) {
          tryHideFullScreenLoading()
          return Promise.reject(error)
      }
      config.__retryCount += 1
      let backoff = new Promise(function (resolve) {
          setTimeout(function () {
              resolve()
          }, config.retryDelay || 1)
      })
      tryHideFullScreenLoading()
      return backoff.then(function () {
          config.url = url
          return http(config)
      })
    } else {
      if (error.response && !utils.isEmpty(error.response.status)) {
        if (error.response.status === 401) {
            const domain = window.location.host
                .split('.')
                .slice(1)
                .join('.')
            // setLocalCookieDomain(userTokenStorageKey, '', domain)
            localStorage.clear()
            Message({
                message: '请先登陆再操作',
                type: 'warning'
            });
            router.push('/login')
        }
        // 400,500异常处理，统一提示错误消息
        if (error.response.status === 500 || error.response.status === 400) {
            Message({
                message: error.response.data.message || '服务器异常，请联系管理员',
                type: 'error',
            })  
        }
        if (error.response.status === 404) {
            router.push({
                path: '/error/404'
            })
        }
        if (error.response.status === 403) {
            // router.push({
            //     path: '/error/403'
            // })
            Message({
                message: error.response.data.msg || '没有操作权限！',
                type: 'error'
            });
        }
        let errorInfo =  error.response.data.error ? error.response.data.error.message : error.response.data;
        return Promise.reject(errorInfo);
      }
    }
  }
)

export default service