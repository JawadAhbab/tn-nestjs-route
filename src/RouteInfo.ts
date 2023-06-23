import { RouteBodyInfo } from './RouteField/RouteBody'
import { RouteFileInfo } from './RouteField/RouteFile'
import { RouteParamInfo } from './RouteField/RouteParam'
export interface RouteInfo {
  $route: true
  route: string
  params: RouteParamInfo[]
  bodies: RouteBodyInfo[]
  files: RouteFileInfo[]
}

export const createRouteInfo = (routecls: Function): RouteInfo => {
  const base = routecls.prototype.$routebase
  const params: RouteParamInfo[] = []
  const bodies: RouteBodyInfo[] = []
  const files: RouteFileInfo[] = []
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

  const route = [base, ...paramnames.map(n => `:${n}`)]
    .join('/')
    .replace(/[ \s]+/g, '')
    .replace(/[\\\/]+/g, '/')

  return { $route: true, route, params, bodies, files }
}
