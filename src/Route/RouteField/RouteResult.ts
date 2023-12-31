import { isArray } from 'tn-validate'
import { Selects } from './accessories/RouteFieldTypes'
import { getAllProperties } from '../accessories/getAllProperties'
const rtypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore
export type RouteResultType = (typeof rtypes)[number]
export type RouteResultInfo = RouteResultJson[] | 'String' | 'Buffer'
export interface RouteResultJson {
  $result: true
  name: string
  type: RouteResultType
  selects: Selects | null
  optional: boolean
  object: RouteResultJson[]
}
interface Options {
  selects?: Selects
  optional?: boolean
  type?: Function | [Function]
}

export const RouteResult = (opts?: Options) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    let typename: string = ''
    let object: RouteResultJson[] = []
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
        getAllProperties(expcls).forEach(p => {
          const value = expcls.prototype[p] as RouteResultJson
          if (value.$result) object.push(value)
        })
      }
    }

    const type = typename.toLowerCase() as RouteResultType
    if (!rtypes.includes(type)) throw new Error(`@RouteResult(${name}) must be typeof ${rtypes}\n`)
    const get = (): RouteResultJson => ({
      $result: true,
      name,
      type,
      optional,
      object,
      selects: opts?.selects || null,
    })

    Object.defineProperty(target, name, { get })
  }
}
