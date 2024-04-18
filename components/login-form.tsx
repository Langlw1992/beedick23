'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { singIn, signUp } from '@/app/(system)/(login)/actions'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { RotateCw } from 'lucide-react'
import { SCHEMA_USER_BASIC_INFO } from '@/lib/schemas'
import { useToast } from '@/components/ui/use-toast'

const fieldsEnum = SCHEMA_USER_BASIC_INFO.keyof()

/**
 * 表单字段枚举类型
 */
type Fields = z.infer<typeof fieldsEnum>

/**
 * 表单字段配置
 */
type FieldConfig = {
  label: string
  name: string
  placeholder?: string
  extra?: {
    label: string
    type: 'link'
    url: string
  }
}

/**
 * 表单配置
 */
type FormConfig = {
  title: string
  failedTitle: string
  description: string
  buttonLabel: string
  buttonLoading: string
  fields: FieldConfig[]
  footer: {
    label: string
    link: {
      label: string
      url: string
    }
  }
}

/**
 * 表单类型
 */
type FormType = 'signIn' | 'signUp'

interface LoginFormProps {
  type: FormType
}

/**
 * 表单配置
 *  - signIn 登录表单
 *  - signUp 注册表单
 */
const formConfig: Record<FormType, FormConfig> = {
  signIn: {
    title: '用户登录',
    failedTitle: '登录失败',
    description: '请输入邮箱和密码登录系统',
    buttonLabel: '登录',
    buttonLoading: '登录中...',
    fields: [
      {
        label: '邮箱',
        name: 'email',
        placeholder: 'Email',
      },
      {
        label: '密码',
        name: 'password',
        placeholder: '密码',
        extra: {
          label: '忘记密码？',
          type: 'link',
          url: '/forgot-password',
        },
      },
    ],
    footer: {
      label: '还没有账号？',
      link: {
        label: '立即注册',
        url: '/sign-up',
      },
    },
  },
  signUp: {
    title: '用户注册',
    failedTitle: '注册失败',
    description: '请输入用户信息创建账号',
    buttonLabel: '注册',
    buttonLoading: '注册中...',
    fields: [
      {
        label: '邮箱',
        name: 'email',
        placeholder: 'Email',
      },
      {
        label: '密码',
        name: 'password',
        placeholder: '密码',
      },
    ],
    footer: {
      label: '已有账号？',
      link: {
        label: '立即登录',
        url: '/sign-in',
      },
    },
  },
}

export default function LoginForm(props: LoginFormProps) {
  const { type } = props
  const { title, description, buttonLabel, buttonLoading, failedTitle, fields, footer } = formConfig[type]
  const singAction = type === 'signIn' ? singIn : signUp
  const { toast } = useToast()
  /**
   * form
   */
  const form = useForm<z.infer<typeof SCHEMA_USER_BASIC_INFO>>({
    resolver: zodResolver(SCHEMA_USER_BASIC_INFO),
    defaultValues: {
      email: '',
      password: '',
      // name: '',
      // phone: '',
    },
  })

  /**
   * 获取表单值
   */
  const onSubmit = async (data: z.infer<typeof SCHEMA_USER_BASIC_INFO>) => {
    console.log('submit', data)
    const resData = await singAction(data)
    if (resData?.success === false) {
      toast({
        title: failedTitle,
        description: resData.message,
        variant: 'destructive',
      })
    }
  }
  return (
    <Card className={'mx-auto max-w-sm'}>
      <CardHeader>
        <CardTitle className={'text-2xl'}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className={'grid gap-4'} onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((formItem) => (
              <div className={'grid gap-2'} key={formItem.name}>
                {formItem.extra ? (
                  <div className={'flex items-center'}>
                    <Label htmlFor={formItem.name}>{formItem.label}</Label>
                    <Link href={formItem.extra.url} className={'ml-auto inline-block text-sm underline'}>
                      {formItem.extra.label}
                    </Link>
                  </div>
                ) : (
                  <Label htmlFor={formItem.name}>{formItem.label}</Label>
                )}
                <FormField
                  name={formItem.name as Fields}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={formItem.placeholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              className={'w-full'}
              type={'submit'}
              disabled={form.formState.isSubmitting}
              onClick={() => {
                console.log('click')
              }}
            >
              {form.formState.isSubmitting ? (
                <>
                  <RotateCw className={'mr-2 h-4 w-4 animate-spin'} />
                  {buttonLoading}
                </>
              ) : (
                buttonLabel
              )}
            </Button>
            <Button className={'w-full'} variant={'outline'} type={'button'}>
              使用 Github 登录
            </Button>
          </form>
        </Form>
        <div className={'mt-4 text-center text-sm'}>
          {footer.label}{' '}
          <Link href={footer.link.url} className={'underline'}>
            {footer.link.label}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
