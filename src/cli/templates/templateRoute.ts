import { isString } from 'tn-validate'
import { RouteBodyInfo } from '../../Route/RouteField/RouteBody'
import { RouteResultJson } from '../../Route/RouteField/RouteResult'
import { RouteInfo } from '../../Route/RouteInfo/RouteInfo'
import { Selects } from '../../Route/RouteField/accessories/RouteFieldTypes'
const selectUnion = (selects: Selects) => selects.map(s => (isString(s) ? `'${s}'` : s)).join('|')

export const templateRoute = (routeinfo: RouteInfo) => {
  const name = routeinfo.name.replace(/Route$/, '')
  let vartypes = loopableType(routeinfo.bodies)
  if (routeinfo.routesecure) vartypes += `${routeinfo.routesecure.name}:string;`
  const pqfs = [...routeinfo.params, ...routeinfo.queries, ...routeinfo.files]
  pqfs.forEach(({ type, name, optional, selects }) => {
    const vtype = type === 'file' ? 'File' : type === 'file[]' ? 'File[]' : type
    const ttype = selects ? selectUnion(selects) : `${vtype}${optional ? ' | null' : ''}`
    vartypes += `${name}${optional ? '?' : ''}:${ttype};`
  })

  const r = routeinfo.results
  const istype = r === 'Buffer' || r === 'String'
  const res = r === 'Buffer' ? 'ArrayBuffer' : r === 'String' ? 'string' : loopableType(r)

  let template = `
const info${name}: RouteInfo = ${JSON.stringify(routeinfo)}
export interface Route${name}Variables {${vartypes}}
export ${istype ? 'type' : 'interface'} Route${name}Result ${istype ? `= ${res}` : `{${res}}`}
export const url${name} = (variables: Route${name}Variables) => createUrl(info${name}, variables)
export const axios${name} = (props: AxiosRequestProps<Route${name}Variables, Route${name}Result>) => createAxiosRequest(info${name}, props)
`

  if (routeinfo.cdnconfig.bunnysecure) {
    let vartypes = ''
    routeinfo.cdnconfig.secureroute!.params.forEach(({ name, type, selects }) => {
      const ttype = selects ? selectUnion(selects) : type
      vartypes += `${name}:${ttype};`
    })
    template += `
export interface BunnyToken${name}Variables {${vartypes}}
export const bunnytoken${name} = (variables: BunnyToken${name}Variables) => createBunnySignature(info${name}, variables)
`
  }

  return template
}

type LoopableInfo = RouteBodyInfo[] | RouteResultJson[]
const loopableType = (infos: LoopableInfo) => {
  let strtype = ''
  infos.forEach(({ name, type, optional, selects, object }) => {
    const isobj = type === 'object' || type === 'object[]'
    if (!isobj) {
      const ttype = selects ? selectUnion(selects) : `${type}${optional ? ' | null' : ''}`
      strtype += `${name}${optional ? '?' : ''}:${ttype};`
    } else {
      const isarr = type === 'object[]'
      const loopttype = `{${loopableType(object)}}${isarr ? '[]' : ''}${optional ? ' | null' : ''}`
      const ttype = selects ? selectUnion(selects) : loopttype
      strtype += `${name}${optional ? '?' : ''}:${ttype};`
    }
  })
  return strtype
}
