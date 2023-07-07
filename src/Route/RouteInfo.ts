import { OptionLess } from 'tn-typescript'
import { RouteCdnConfig } from './Route'
import { RouteBodyInfo } from './RouteField/RouteBody'
import { RouteFileInfo } from './RouteField/RouteFile'
import { RouteParamInfo } from './RouteField/RouteParam'
import { RouteQueryInfo } from './RouteField/RouteQuery'
import { RouteResultInfo, RouteResultJson } from './RouteField/RouteResult'
import { RouteSecureInfo } from './RouteField/RouteSecure'
import { getAllProperties } from './accessories/getAllProperties'
export type RouteMethod = 'GET' | 'POST'
export interface RouteInfo {
  $route: true
  route: string
  method: RouteMethod
  name: string
  secure: false | { name: string }
  cdnconfig: OptionLess<RouteCdnConfig>
  queries: RouteQueryInfo[]
  params: RouteParamInfo[]
  bodies: RouteBodyInfo[]
  files: RouteFileInfo[]
  results: RouteResultInfo
  getSecureSecret: () => string | undefined
}

export const createRouteInfo = (
  method: RouteMethod,
  routecls: Function,
  resultcls?: Function
): RouteInfo => {
  const paramsUnindexed: RouteParamInfo[] = []
  const paramsIndexed: RouteParamInfo[] = []
  const queries: RouteQueryInfo[] = []
  const bodies: RouteBodyInfo[] = []
  const files: RouteFileInfo[] = []
  const paramnames: string[] = []
  let secureinfo!: RouteSecureInfo

  getAllProperties(routecls).forEach(p => {
    const body = routecls.prototype[p] as RouteBodyInfo
    if (body.$body) return bodies.push(body)

    const secure = body as unknown as RouteSecureInfo
    if (secure.$secure) return (secureinfo = secure)

    const query = body as unknown as RouteQueryInfo
    if (query.$query) return queries.push(query)

    const file = body as unknown as RouteFileInfo
    if (file.$file) return files.push(file)

    const param = body as unknown as RouteParamInfo
    if (!param.$param) return
    if (param.index) paramsIndexed.splice(param.index, 0, param)
    else paramsUnindexed.push(param)
    paramnames.push(p)
  })

  let results: RouteResultInfo = 'String'
  if (resultcls?.name === 'String') results = 'String'
  else if (resultcls?.name === 'Buffer') results = 'Buffer'
  else if (resultcls) {
    const resjson: RouteResultJson[] = []
    getAllProperties(resultcls).forEach(p => {
      const result = resultcls.prototype[p] as RouteResultJson
      if (result.$result) return resjson.push(result)
    })
    results = resjson
  }

  const cdnconfig = routecls.prototype.$routecdnconfig as OptionLess<RouteCdnConfig>
  let base = routecls.prototype.$routebase
  if (cdnconfig.secure) base = '/-secure-/' + base
  if (cdnconfig.perma) base = '/-perma-/' + base

  return {
    $route: true,
    route: [base, ...paramnames.map(n => `:${n}`)].join('/').replace(/[\\\/]+/g, '/'),
    method,
    name: routecls.name,
    secure: !secureinfo ? false : { name: secureinfo.name },
    cdnconfig,
    queries,
    params: [...paramsUnindexed, ...paramsIndexed],
    bodies,
    files,
    results,
    getSecureSecret: () => secureinfo?.secret,
  }
}
