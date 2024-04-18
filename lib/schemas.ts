import { z } from 'zod'

/**
 * 用户基本信息Schema
 */
export const SCHEMA_USER_BASIC_INFO = z.object({
  email: z.string().email('请输入正确的邮箱格式'),
  password: z.string().min(6, '密码长度不能小于6位').max(20, '密码长度不能大于20位'),
  name: z.string().min(2, '用户名长度不能小于2位').max(20, '用户名长度不能大于20位').optional(),
  phone: z.string().min(11, '手机号码长度不能小于11位').max(11, '手机号码长度不能大于11位').optional(),
})
