interface Props {
  site: string
  cdn?: string
  cdnaccess?: string
  loggerImport?: string
  loggerMethod?: string
}

export const templateBasics = ({ site, cdn, cdnaccess, loggerImport, loggerMethod }: Props) => {
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

const getNextReferenceTime = (exp: string) => {
  const starting = new Date().getTime()
  const validity = ms(exp)
  return new Date(Math.ceil((starting + validity) / validity) * validity).getTime()
}

const createBunnySignature = (info: RouteInfo, variables: AnyObject) => {
  const tokenroute = info.cdnconfig.secureroute!.tokenroute
  const exp = info.cdnconfig.bunnysecure || '30d'
  const access = ${cdnaccess}
  const expires = Math.ceil(getNextReferenceTime(exp) / 1000)
  const path = tokenroute.replace(/\\:(\\w+)/g, (_, k) => encodeURIComponent(variables[k]))
  const queries = 'token_path=' + path
  const tokenbasics = access + path + expires + queries
  const token = Buffer.from(sha(tokenbasics).toString(), 'hex').toString('base64url')
  return { token, token_path: path, expires }
}

const getRouteSecureToken = (rs: RouteSecure, variables: AnyObject, info: RouteInfo) => {
  const { name, timesafe } = rs
  const secret = variables[name]
  const checks: string[] = []
  info.params.forEach(({ name }) => {
    const val = variables[name]
    const isnull = val === null || val === undefined
    checks.push(isnull ? '-' : val)
  })
  info.queries.forEach(({ name, routesecure }) => {
    if (!routesecure) return
    const val = variables[name]
    const isnull = val === null || val === undefined
    if (!isnull) checks.push(val)
  })
  info.bodies.forEach(({ name, routesecure }) => {
    if (!routesecure) return
    const val = variables[name]
    const isnull = val === null || val === undefined
    if (!isnull) checks.push(JSON.stringify(val))
  })

  const checkstr = checks.join('/')
  if (!timesafe) return sha(checkstr + secret).toString()
  const exp = new Date().getTime() + ms(timesafe)
  return exp + '.' + sha(checkstr + exp + secret).toString()
}

const createUrl = (info: RouteInfo, variables: AnyObject) => {
  const paramobj: AnyObject = {}
  const queryarr: string[] = []
  info.params.forEach(({ name }) => {
    const val = variables[name]
    const isnull = val === null || val === undefined
    paramobj[name] = isnull ? '-' : encodeURIComponent(val)
  })
  info.queries.forEach(({ name }) => {
    const val = variables[name]
    const isnull = val === null || val === undefined
    if (!isnull) queryarr.push(name + '=' + String(variables[name]))
  })

  if (info.routesecure) {
    const rs = info.routesecure
    const token = getRouteSecureToken(rs, variables, info)
    if (rs.query) queryarr.push(rs.name + '=' + token)
    else paramobj[rs.name] = token
  }

  if (info.cdnconfig.secureroute) {
    const { token, token_path, expires } = variables.bunnytoken
    queryarr.push('token=' + token)
    queryarr.push('token_path=' + token_path)
    queryarr.push('expires=' + expires)
  }

  const site = ${site}
  const cdn = ${cdn ? cdn : 'site'}
  const address = (info.cdnconfig.bunnycdn ? cdn : site).replace(/[\\\\\\/]$/, '') + '/'
  const queries = queryarr.join('&')
  const urlr = info.route.replace(/\\:(\\w+)/g, (_, k) => paramobj[k]).replace(/^[\\\\\\/]/, '')

  return address + urlr + (queries ? '?' : '') + queries
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
