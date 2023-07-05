import { RouteBodyInfo } from './RouteField/RouteBody'
import { RouteFileInfo } from './RouteField/RouteFile'
import { RouteParamInfo } from './RouteField/RouteParam'
import { RouteQueryInfo } from './RouteField/RouteQuery'
import { RouteResultInfo, RouteResultJson } from './RouteField/RouteResult'
export type RouteMethod = 'GET' | 'POST'
export interface RouteInfo {
  $route: true
  route: string
  method: RouteMethod
  name: string
  queries: RouteQueryInfo[]
  params: RouteParamInfo[]
  bodies: RouteBodyInfo[]
  files: RouteFileInfo[]
  results: RouteResultInfo
}

export const createRouteInfo = (
  method: RouteMethod,
  routecls: Function,
  resultcls?: Function
): RouteInfo => {
  const base = routecls.prototype.$routebase
  const name = routecls.name
  const preparams: RouteParamInfo[] = []
  const queries: RouteQueryInfo[] = []
  const bodies: RouteBodyInfo[] = []
  const files: RouteFileInfo[] = []
  const paramnames: string[] = []

  Object.getOwnPropertyNames(routecls.prototype).forEach(p => {
    const body = routecls.prototype[p] as RouteBodyInfo
    if (body.$body) return bodies.push(body)

    const query = body as unknown as RouteQueryInfo
    if (query.$query) return queries.push(query)

    const file = body as unknown as RouteFileInfo
    if (file.$file) return files.push(file)

    const param = body as unknown as RouteParamInfo
    if (!param.$param) return
    if (param.index) preparams[param.index] = param
    else preparams.push(param)
    paramnames.push(p)
  })

  let results: RouteResultInfo = 'String'
  if (resultcls?.name === 'String') results = 'String'
  else if (resultcls?.name === 'Buffer') results = 'Buffer'
  else if (resultcls) {
    const resjson: RouteResultJson[] = []
    Object.getOwnPropertyNames(resultcls.prototype).forEach(p => {
      const result = resultcls.prototype[p] as RouteResultJson
      if (result.$result) return resjson.push(result)
    })
    results = resjson
  }

  const route = [base, ...paramnames.map(n => `:${n}`)]
    .join('/')
    .replace(/[ \s]+/g, '')
    .replace(/[\\\/]+/g, '/')

  const params = preparams.filter(i => i)
  return { $route: true, name, method, route, queries, params, bodies, files, results }
}
