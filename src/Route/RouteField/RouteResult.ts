import { ObjectOf } from 'tn-typescript'
import { isArray } from 'tn-validate'
const rtypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore
export type RouteResultType = (typeof rtypes)[number]
export interface RouteResultInfo {
  $result: true
  name: string
  type: RouteResultType
  optional: boolean
  object: ObjectOf<RouteResultInfo>
}
interface Options {
  optional?: boolean
  type?: Function | [Function]
}

export const RouteResult = (opts?: Options) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    let typename: string = ''
    let object: ObjectOf<RouteResultInfo> = {}
    const explicit = opts?.type

    if (!explicit) typename = Reflect.getMetadata('design:type', target, name).name
    else {
      const arr = isArray(explicit)
      const expname = (arr ? explicit[0].name : explicit.name).toLowerCase()
      if (expname === 'array') typename = 'any[]'
      else if (rtypes.includes(expname as any)) typename = arr ? `${expname}[]` : expname
      else {
        const expcls = arr ? explicit[0] : explicit
        typename = arr ? 'object[]' : 'object'
        Object.getOwnPropertyNames(expcls.prototype).forEach(p => {
          const value = expcls.prototype[p] as RouteResultInfo
          if (value.$result) object[p] = value
        })
      }
    }

    const type = typename.toLowerCase() as RouteResultType
    if (!rtypes.includes(type)) throw new Error(`@RouteResult(${name}) must be typeof ${rtypes}\n`)
    const getter = (): RouteResultInfo => ({ $result: true, name, type, optional, object })
    Object.defineProperty(target, name, { get: getter })
  }
}
