/**
 * 请求发起配置
 */
export interface Req extends RequestInit {
  /**
   * 请求地址
   */
  url: string

  /**
   * 请求方式
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /**
   * 请求头
   */
  headers?: Headers

  /**
   * 请求参数,任何请求方式都可以传递
   */
  data?: any

  /**
   * 超时时间
   */
  timeout?: number

  /**
   * 请求发送的数据类型
   */
  type?: 'json' | 'text' | 'blob' | 'formData'

  /**
   * 忽略业务类型检查
   */
  ignoreBizCheck?: boolean

  /**
   * 是否使用原始数据
   */
  raw?: true
}

/**
 * 请求成功返回
 */
export interface SuccessRes<T> {
  [key: string]: any
  success: true
  errorCode: number
  errorMsg?: string
  data: T
}

/**
 * 请求失败返回
 */
export interface ErrorRes {
  success: false
  errorCode: number
  errorMsg: string
}

export type Res<T = any> = SuccessRes<T> | ErrorRes
