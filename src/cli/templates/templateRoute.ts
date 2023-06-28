import { RouteBodyInfo } from '../../Route/RouteField/RouteBody'
import { RouteResultJson } from '../../Route/RouteField/RouteResult'
import { RouteInfo } from '../../Route/RouteInfo'

export const templateRoute = (routeinfo: RouteInfo) => {
  const name = routeinfo.name.replace(/Route$/, '')
  let vartypes = loopableType(routeinfo.bodies)
  const pqfs = [...routeinfo.params, ...routeinfo.queries, ...routeinfo.files]
  pqfs.forEach(({ type, name, optional }) => {
    const vtype = type === 'file' ? 'File' : type === 'file[]' ? 'File[]' : type
    vartypes += `${name}${optional ? '?' : ''}:${vtype};`
  })

  const r = routeinfo.results
  const istype = r === 'Buffer' || r === 'String'
  const res = r === 'Buffer' ? 'ArrayBuffer' : r === 'String' ? 'string' : loopableType(r)

  return `
const info${name}: RouteInfo = ${JSON.stringify(routeinfo)}
export interface Route${name}Variables {${vartypes}}
export ${istype ? 'type' : 'interface'} Route${name}Result ${istype ? `= ${res}` : `{${res}}`}
export const url${name} = (variables: Route${name}Variables) => createUrl(info${name}, variables)
export const axios${name} = (props: AxiosRequestProps<Route${name}Variables, Route${name}Result>) => createAxiosRequest(info${name}, props)
`
}

type LoopableInfo = RouteBodyInfo[] | RouteResultJson[]
const loopableType = (infos: LoopableInfo) => {
  let strtype = ''
  infos.forEach(({ name, type, optional, object }) => {
    const isobj = type === 'object' || type === 'object[]'
    if (!isobj) strtype += `${name}${optional ? '?' : ''}:${type};`
    else {
      const isarr = type === 'object[]'
      strtype += `${name}${optional ? '?' : ''}:{${loopableType(object)}}${isarr ? '[]' : ''};`
    }
  })
  return strtype
}
