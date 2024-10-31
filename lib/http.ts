import { toastError } from './utils'

// 定义接口和类型
interface Config {
  baseURL: string
  headers: Record<string, string>
  timeout: number
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestConfig extends Partial<Config> {
  method?: HttpMethod
  body?: string
  signal?: AbortSignal
}

// 定义默认配置
const defaultConfig: Config = {
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60 * 1000,
}

class HttpClient {
  private config: Config

  constructor(config: Partial<Config> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  async request<T>(
    method: HttpMethod,
    url: string,
    data: unknown = null,
    customConfig: Partial<RequestConfig> = {}
  ): Promise<T> {
    let fullUrl = this.config.baseURL + url
    const config: RequestConfig = {
      ...this.config,
      ...customConfig,
      method,
      headers: { ...this.config.headers, ...customConfig.headers },
    }

    if (data) {
      if (method === 'GET' || method === 'DELETE') {
        fullUrl += '?' + new URLSearchParams(data as Record<string, string>).toString()
      } else {
        config.body = JSON.stringify(data)
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeout)

    try {
      const response = await fetch(fullUrl, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const { message, data } = await response.json()
      if (!response.ok) {
        toastError(message)
        return Promise.reject(message)
      }

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  get<T>(url: string, params?: Record<string, string | number>, config?: Partial<RequestConfig>): Promise<T>
  get<T>(args: [string, Record<string, string | number>?, Partial<RequestConfig>?]): Promise<T>
  get<T>(
    urlOrArgs: string | [string, Record<string, string | number>?, Partial<RequestConfig>?],
    params?: Record<string, string | number>,
    config?: Partial<RequestConfig>
  ): Promise<T> {
    if (Array.isArray(urlOrArgs)) {
      return http.request<T>('GET', ...urlOrArgs)
    }
    return http.request<T>('GET', urlOrArgs, params, config)
  }

  post<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T>
  post<T>(args: [string, unknown?, Partial<RequestConfig>?]): Promise<T>
  post<T>(
    urlOrArgs: string | [string, unknown?, Partial<RequestConfig>?],
    data?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<T> {
    if (Array.isArray(urlOrArgs)) {
      return http.request<T>('POST', ...urlOrArgs)
    }
    return http.request<T>('POST', urlOrArgs, data, config)
  }

  put<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T>
  put<T>(args: [string, unknown?, Partial<RequestConfig>?]): Promise<T>
  put<T>(
    urlOrArgs: string | [string, unknown?, Partial<RequestConfig>?],
    data?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<T> {
    if (Array.isArray(urlOrArgs)) {
      return http.request<T>('PUT', ...urlOrArgs)
    }
    return http.request<T>('PUT', urlOrArgs, data, config)
  }

  delete<T>(url: string, params?: Record<string, string | number>, config?: Partial<RequestConfig>): Promise<T>
  delete<T>(args: [string, Record<string, string | number>?, Partial<RequestConfig>?]): Promise<T>
  delete<T>(
    urlOrArgs: string | [string, Record<string, string | number>?, Partial<RequestConfig>?],
    params?: Record<string, string | number>,
    config?: Partial<RequestConfig>
  ): Promise<T> {
    if (Array.isArray(urlOrArgs)) {
      return http.request<T>('DELETE', ...urlOrArgs)
    }
    return http.request<T>('DELETE', urlOrArgs, params, config)
  }
}

// export function get<T>(
//   url: string,
//   params?: Record<string, string | number>,
//   config?: Partial<RequestConfig>
// ): Promise<T>
// export function get<T>(args: [string, Record<string, string | number>?, Partial<RequestConfig>?]): Promise<T>
// export function get<T>(
//   urlOrArgs: string | [string, Record<string, string | number>?, Partial<RequestConfig>?],
//   params?: Record<string, string | number>,
//   config?: Partial<RequestConfig>
// ): Promise<T> {
//   if (Array.isArray(urlOrArgs)) {
//     return http.request<T>('GET', ...urlOrArgs)
//   }
//   return http.request<T>('GET', urlOrArgs, params, config)
// }

// export function post<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T>
// export function post<T>(args: [string, unknown?, Partial<RequestConfig>?]): Promise<T>
// export function post<T>(
//   urlOrArgs: string | [string, unknown?, Partial<RequestConfig>?],
//   data?: unknown,
//   config?: Partial<RequestConfig>
// ): Promise<T> {
//   if (Array.isArray(urlOrArgs)) {
//     return http.request<T>('POST', ...urlOrArgs)
//   }
//   return http.request<T>('POST', urlOrArgs, data, config)
// }

// export function put<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T>
// export function put<T>(args: [string, unknown?, Partial<RequestConfig>?]): Promise<T>
// export function put<T>(
//   urlOrArgs: string | [string, unknown?, Partial<RequestConfig>?],
//   data?: unknown,
//   config?: Partial<RequestConfig>
// ): Promise<T> {
//   if (Array.isArray(urlOrArgs)) {
//     return http.request<T>('PUT', ...urlOrArgs)
//   }
//   return http.request<T>('PUT', urlOrArgs, data, config)
// }

// export function del<T>(
//   url: string,
//   params?: Record<string, string | number>,
//   config?: Partial<RequestConfig>
// ): Promise<T>
// export function del<T>(args: [string, Record<string, string | number>?, Partial<RequestConfig>?]): Promise<T>
// export function del<T>(
//   urlOrArgs: string | [string, Record<string, string | number>?, Partial<RequestConfig>?],
//   params?: Record<string, string | number>,
//   config?: Partial<RequestConfig>
// ): Promise<T> {
//   if (Array.isArray(urlOrArgs)) {
//     return http.request<T>('DELETE', ...urlOrArgs)
//   }
//   return http.request<T>('DELETE', urlOrArgs, params, config)
// }

// 创建实例
export const http = new HttpClient({})
