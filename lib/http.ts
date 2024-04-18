/**
 * 基于fetch api的http模块，用于处理http请求，包括请求拦截、响应拦截等
 */

import { type Req, type Res } from '@/lib/types'

/**
 * 默认超时时间
 */
const DEFAULT_TIMEOUT = 60 * 1000

/**
 * 不含body的请求方法
 */
const NO_BODY_METHODS = ['GET', 'HEAD', 'DELETE']

/**
 * request拦截器, 用于处理请求前的逻辑
 */
const requestInterceptors: Array<(req: Request) => Request> = []

/**
 * response拦截器, 用于处理请求后的逻辑
 */
const responseInterceptors: Array<(res: Response) => Response> = []

/**
 * 默认业务错误处理
 * @param {Res} data 请求返回数据
 */
function handleDefaultBiz<T>(data: Res<T>) {
  if (!data.success) {
    throw new Error(data.errorMsg)
  }
  return data
}

/**
 * 获取默认请求头
 * @returns {Headers}
 */
function getDefaultHeaders(): Headers {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('x-requested-with', 'XMLHttpRequest')
  // 浏览器环境下，从localStorage中获取token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      headers.append('Authorization', `Bearer ${token}`)
    }
  }
  return headers
}

/**
 * 根据请求方式处理请求参数
 * @param {Req} options
 * @returns {string} 请求参数
 */
function getParams(options: Req): string {
  const { method, data } = options
  if (!method || NO_BODY_METHODS.includes(method)) {
    const query = new URLSearchParams(data).toString()
    return query ? `?${query}` : ''
  }
  return JSON.stringify(data)
}

/**
 * 根据请求参数创建Request对象
 * @param {Req} options 请求参数
 */
function generateRequestInit(options: Req) {
  const { data, headers, url, method = 'GET', timeout = DEFAULT_TIMEOUT, ...restOptions } = options
  const controller = new AbortController()
  const { signal } = controller
  const defaultHeaders = getDefaultHeaders()
  const requestHeaders = Object.assign(defaultHeaders, headers)
  let requestUrl = url
  let body = undefined

  /** 处理请求参数,区分URL参数和body参数 */
  const params = getParams(options)
  if (data) {
    if (NO_BODY_METHODS.includes(method)) {
      requestUrl = url.includes('?') ? `${url}&${params}` : `${url}?${params}`
    } else {
      body = params
    }
  }

  /** 判断是否为浏览器环境，处理相对路径 */
  if (typeof window !== 'undefined') {
    /** 浏览器环境 */
    if (!url.startsWith('http')) {
      requestUrl = `${window.location.origin}${url}`
    }
  } else {
    /** Node环境 */
    const { API_HOST } = process.env
    if (API_HOST) {
      requestUrl = `${API_HOST}${url}`
    }
  }
  const fetchOptions: RequestInit = {
    method: method,
    headers: requestHeaders,
    body,
    signal,
    ...restOptions,
  }
  const request = new Request(requestUrl, fetchOptions)
  /** 超时处理 */
  const timer = setTimeout(() => {
    controller.abort()
  }, timeout)
  return { request, timer }
}
/**
 * 处理非200状态码:
 * @param {Response} response 请求响应
 */
function handleStatusError(response: Response) {
  switch (response.status) {
    case 401:
      // todo 未登录处理
      break
    case 403:
      // todo 无权限处理
      break
    case 404:
      // todo 404处理
      break
    case 500:
      // todo 500处理
      break
    default:
      break
  }
  throw new Error(response.statusText)
}

/**
 * 请求处理
 * @param {Response} response 请求响应
 * @param {Req['type']} type 响应类型
 * todo 其他类型处理
 */
function handleRaw(response: Response, type: Req['type']) {
  if (type === 'text') {
    return response.text()
  }
  if (type === 'blob') {
    return response.blob()
  }
  if (type === 'formData') {
    return response.formData()
  }
  throw new Error(response.statusText)
}

/**
 * 发起请求，返回未处理的响应
 * @param {Req} options 请求参数
 * @returns {Promise<Response>} 请求响应
 */
async function triggerRequest(options: Req): Promise<Response> {
  const { request, timer } = generateRequestInit(options)
  /** 请求拦截器 */
  if (requestInterceptors.length) {
    requestInterceptors.forEach((interceptor) => {
      interceptor(request)
    })
  }
  let response: Response
  try {
    response = await fetch(request)
    clearTimeout(timer)
    if (!response.ok) {
      handleStatusError(response)
    }
    if (responseInterceptors.length) {
      responseInterceptors.forEach((interceptor) => {
        interceptor(response)
      })
    }
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('请求超时')
    }
    throw error
  }
}

/**
 * 普通JSON格式返回的请求
 * @param {Req} config 请求参数
 */
async function getResponseInJson(config: Req) {
  const response = await triggerRequest(config)
  return await response.json()
}

/**
 * get请求
 */
async function get(config: Req) {
  const data = await getResponseInJson({ ...config, method: 'GET' })
  let res = data
  if (!config.ignoreBizCheck) {
    res = handleDefaultBiz(data)
  }
  if (!config.raw) {
    res = res.data
  }
  return res
}

async function post<T>(config: Req) {
  return await getResponseInJson({ ...config, method: 'POST' })
}

export { get, post }
