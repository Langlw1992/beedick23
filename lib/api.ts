import { queryOptions } from '@tanstack/react-query'
import { get } from './http'
const COMMON_PREFIX = '/api'

export const api = {
  /**
   * 获取系统设置
   */
  getAppMetadata: () =>
    queryOptions({
      queryKey: ['getAppMetadata'],
      queryFn: () => get({ url: COMMON_PREFIX + '/system/getAppMetadata' }),
    }),

  /**
   * 获取公钥
   */
  getPublicKey: () =>
    queryOptions<{ publicKey: string }>({
      queryKey: ['getPublicKey'],
      queryFn: () => get({ url: COMMON_PREFIX + '/security/user/getLoginPublicKey', cache: 'no-cache' }),
    }),

  /**
   * 获取密码配置
   */
  getPwdConfig: () =>
    queryOptions({
      queryKey: ['getPwdConfig'],
      queryFn: () => get({ url: COMMON_PREFIX + '/security/config/loginConfig/getPwdConfig' }),
    }),

  /**
   * 获取验证码
   */
  getCaptcha: () =>
    queryOptions({
      queryKey: ['getCaptcha'],
      queryFn: () => get({ url: COMMON_PREFIX + '/security/captcha/getCaptcha', cache: 'no-cache' }),
    }),

  /**
   * 登录
   */
  login: (data: { userAccount: string; password: string; code: string }) =>
    queryOptions({
      queryKey: ['login'],
      queryFn: () => get({ url: COMMON_PREFIX + '/sso/login', data }),
    }),
}
