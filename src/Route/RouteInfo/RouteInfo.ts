import { RouteBodyInfo } from '../RouteField/RouteBody'
import { RouteFileInfo } from '../RouteField/RouteFile'
import { RouteParamInfo } from '../RouteField/RouteParam'
import { RouteQueryInfo } from '../RouteField/RouteQuery'
import { RouteResultInfo } from '../RouteField/RouteResult'
import { RouteCdnConfig, routeInfoCdnConfig } from './accessories/routeInfoCdnConfig'
import { routeInfoFields } from './accessories/routeInfoFields'
import { routeInfoResults } from './accessories/routeInfoResults'
import { routeInfoRoute } from './accessories/routeInfoRoute'
import { RouteSecure, routeInfoRouteSecure } from './accessories/routeInfoRouteSecure'
export type RouteMethod = 'GET' | 'POST'
export interface RouteInfo {
  $route: true
  route: string
  method: RouteMethod
  name: string
  routesecure: RouteSecure
  cdnconfig: RouteCdnConfig
  queries: RouteQueryInfo[]
  params: RouteParamInfo[]
  bodies: RouteBodyInfo[]
  files: RouteFileInfo[]
  results: RouteResultInfo
  getRouteSecureSecret: () => string | undefined
}

export const createRouteInfo = (
  method: RouteMethod,
  routecls: Function,
  resultcls?: Function
): RouteInfo => {
  const { params, queries, bodies, files, rsi } = routeInfoFields(routecls)
  const { routebase, cdnconfig } = routeInfoCdnConfig(routecls, params)
  const results = routeInfoResults(resultcls)
  const route = routeInfoRoute({ routebase, params, rsi })
  const routesecure = routeInfoRouteSecure(rsi)
  const name = routecls.name
  return {
    $route: true,
    route,
    method,
    name,
    routesecure,
    cdnconfig,
    queries,
    params,
    bodies,
    files,
    results,
    getRouteSecureSecret: () => rsi?.secret,
  }
}
