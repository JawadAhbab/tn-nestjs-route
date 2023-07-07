export const templateBasics = (site: string, loggerImport?: string, loggerMethod?: string) => {
  const logger = loggerImport && loggerMethod
  return `
import axios, { AxiosError, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios' // prettier-ignore
import { AnyObject } from 'tn-typescript'
import sha from 'crypto-js/sha256'
import ms from 'ms'
${logger ? `import { ${loggerMethod} } from '${loggerImport}'` : ''}

export type RouteAuth = (callback: (accessToken: string) => void) => void
interface AxiosRequestProps<V = AnyObject, R = any> {
  auth?: RouteAuth
  variables?: V
  signal?: AbortSignal
  headers?: AnyObject
  onProgress?: (e: AxiosProgressEvent) => void
  onSuccess?: (data: R, res: AxiosResponse<R>) => void
  onError?: (err: AxiosError) => void
  onFinally?: () => void
}

const getSecureToken = (name: string, variables: AnyObject, paramstr: string) => {
  const secret = variables[name]
  const exp = new Date().getTime() + ms('2m')
  const token = exp + '.' + sha(paramstr + exp + secret).toString()
  return name + '=' + token
}

const createUrl = (info: RouteInfo, variables: AnyObject) => {
  const site = '${site.replace(/[\\\/]$/, '')}/'
  const paramstrs: string[] = []
  const urlr = info.route.replace(/\\:(\\w+)/g, (_, k) => {
    const val = variables[k]
    const isnull = val === null || val === undefined
    const value = isnull ? '-' : encodeURIComponent(val)
    paramstrs.push(value)
    return value
  }).replace(/^[\\\\\\/]/, '')

  const queryarr = info.queries.map(({ name }) => name + '=' + String(variables[name]))
  if (info.secure) queryarr.push(getSecureToken(info.secure.name, variables, paramstrs.join('/')))
  const queries = queryarr.join('&')

  return site + urlr + (queries ? '?' : '') + queries
}

const createAxiosRequest = (info: RouteInfo, props: AxiosRequestProps) => {
  const { onProgress, onSuccess, onError, onFinally, signal } = props
  const { auth, variables = {}, headers = {} } = props
  const url = createUrl(info, variables)
  const multipart = !!info.files.length
  if (multipart) headers['Content-Type'] = false

  let responseType: ResponseType = 'json'
  if (info.results === 'Buffer') responseType = 'arraybuffer'
  else if (info.results === 'String') responseType = 'text'

  let data: AnyObject | FormData
  if (multipart) {
    const formdata = new FormData()
    const entries = [...info.files, ...info.bodies]
    entries.forEach(({ name }) => {
      const entry = variables[name]
      if (entry) formdata.set(name, entry)
    })
    data = formdata
  } else {
    const simpledata: AnyObject = {}
    info.bodies.forEach(({ name }) => (simpledata[name] = variables[name]))
    data = simpledata
  }

  const sendRequest = (accessToken?: string) => {
    if (accessToken) headers.authorization = \`Bearer \${accessToken}\`
    const req: AxiosRequestConfig = { method: info.method, url, signal, responseType, data, headers, onUploadProgress: onProgress } // prettier-ignore
    ${logger ? `${loggerMethod}(req)` : ''}
    axios
      .request(req)
      .then(res => onSuccess && onSuccess(res.data, res))
      .catch(err => onError && onError(err))
      .finally(() => onFinally && onFinally())
  }

  if (!auth) sendRequest()
  else auth((accessToken) => sendRequest(accessToken)) 
}
`
}
