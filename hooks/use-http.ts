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

  private async request<T>(
    url: string,
    method: HttpMethod,
    data: unknown = null,
    customConfig: Partial<RequestConfig> = {}
  ): Promise<T> {
    const fullUrl = this.config.baseURL + url
    const config: RequestConfig = {
      ...this.config,
      ...customConfig,
      method,
      headers: { ...this.config.headers, ...customConfig.headers },
    }

    if (data) {
      if (method === 'GET' || method === 'DELETE') {
        url += '?' + new URLSearchParams(data as Record<string, string>).toString()
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out')
        }
      }
      throw error
    }
  }

  get<T>(url: string, params?: Record<string, string | number>, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>(url, 'GET', params, config)
  }

  post<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>(url, 'POST', data, config)
  }

  put<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>(url, 'PUT', data, config)
  }

  delete<T>(url: string, params?: Record<string, string | number>, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>(url, 'DELETE', params, config)
  }
}

// 创建实例
const http = new HttpClient({})

export function useHttp() {
  return http
}
