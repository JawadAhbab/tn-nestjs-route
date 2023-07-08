import { RouteBodyInfo } from '../../RouteField/RouteBody'
import { RouteFileInfo } from '../../RouteField/RouteFile'
import { RouteParamInfo } from '../../RouteField/RouteParam'
import { RouteQueryInfo } from '../../RouteField/RouteQuery'
import { RouteSecureInfo } from '../../RouteField/RouteSecure'
import { getAllProperties } from '../../accessories/getAllProperties'

export const routeInfoFields = (routecls: Function) => {
  const paramsUnindexed: RouteParamInfo[] = []
  const paramsIndexed: RouteParamInfo[] = []
  const files: RouteFileInfo[] = []
  const queries: RouteQueryInfo[] = []
  const bodies: RouteBodyInfo[] = []
  let rsi!: RouteSecureInfo

  getAllProperties(routecls).forEach(p => {
    const body = routecls.prototype[p] as RouteBodyInfo
    if (body.$body) return bodies.push(body)

    const secure = body as unknown as RouteSecureInfo
    if (secure.$secure) return (rsi = secure)

    const query = body as unknown as RouteQueryInfo
    if (query.$query) return queries.push(query)

    const file = body as unknown as RouteFileInfo
    if (file.$file) return files.push(file)

    const param = body as unknown as RouteParamInfo
    if (!param.$param) return
    if (param.index) paramsIndexed.splice(param.index, 0, param)
    else paramsUnindexed.push(param)
  })

  const params = [...paramsUnindexed, ...paramsIndexed]
  return { params, files, queries, bodies, rsi }
}
