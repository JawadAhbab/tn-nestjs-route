export const templateBasics = (site: string) => `
import axios, { AxiosError, AxiosProgressEvent, AxiosResponse, ResponseType } from 'axios'
import { AnyObject } from 'tn-typescript'

interface AxiosRequestProps<V = AnyObject, R = any> {
  variables?: V
  headers?: AnyObject
  onProgress?: (e: AxiosProgressEvent) => void
  onSuccess?: (data: R, res: AxiosResponse<R>) => void
  onError?: (err: AxiosError) => void
  onFinally?: () => void
}

const createUrl = (info: RouteInfo, variables: AnyObject) => {
  const site = '${site.replace(/[\\\/]$/, '')}/'
  const queries = info.queries.map(({ name }) => name + '=' + String(variables[name])).join('&')
  const urlr = info.route.replace(/\\:(\\w+)/g, (_, k) => variables[k] || '-').replace(/^[\\\\\\/]/, '')
  return site + urlr + (queries ? '?' : '') + queries
}

const createAxiosRequest = (info: RouteInfo, props: AxiosRequestProps) => {
  const { variables = {}, headers = {}, onProgress, onSuccess, onError, onFinally } = props
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

  axios
    .request({
      method: info.method,
      url,
      responseType,
      data,
      headers,
      onUploadProgress: onProgress,
    })
    .then(res => onSuccess && onSuccess(res.data, res))
    .catch(err => onError && onError(err))
    .finally(() => onFinally && onFinally())
}
`
