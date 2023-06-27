import { RouteBodyInfo } from './RouteField/RouteBody'
import { RouteFileInfo } from './RouteField/RouteFile'
import { RouteParamInfo } from './RouteField/RouteParam'
import { RouteResultInfo } from './RouteField/RouteResult'
type Method = 'GET' | 'POST'
export interface RouteInfo {
  $route: true
  route: string
  method: Method
  name: string
  params: RouteParamInfo[]
  bodies: RouteBodyInfo[]
  files: RouteFileInfo[]
  results: RouteResultInfo[]
}

export const createRouteInfo = (
  method: Method,
  routecls: Function,
  resultcls?: Function
): RouteInfo => {
  const base = routecls.prototype.$routebase
  const name = routecls.name
  const params: RouteParamInfo[] = []
  const bodies: RouteBodyInfo[] = []
  const files: RouteFileInfo[] = []
  const results: RouteResultInfo[] = []
  const paramnames: string[] = []

  Object.getOwnPropertyNames(routecls.prototype).forEach(p => {
    const body = routecls.prototype[p] as RouteBodyInfo
    if (body.$body) return bodies.push(body)

    const file = body as unknown as RouteFileInfo
    if (file.$file) return files.push(file)

    const param = body as unknown as RouteParamInfo
    if (!param.$param) return
    params.push(param)
    paramnames.push(p)
  })

  if (resultcls) {
    Object.getOwnPropertyNames(resultcls.prototype).forEach(p => {
      const result = resultcls.prototype[p] as RouteResultInfo
      if (result.$result) return results.push(result)
    })
  }

  const route = [base, ...paramnames.map(n => `:${n}`)]
    .join('/')
    .replace(/[ \s]+/g, '')
    .replace(/[\\\/]+/g, '/')

  return { $route: true, name, method, route, params, bodies, files, results }
}
