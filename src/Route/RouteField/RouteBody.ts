import { isArray } from 'tn-validate'
import { Getter, Selects, Validator } from './accessories/RouteFieldTypes'
import { getAllProperties } from '../accessories/getAllProperties'
const btypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore
export type RouteBodyType = (typeof btypes)[number]
export interface RouteBodyInfo {
  $body: true
  name: string
  type: RouteBodyType
  optional: boolean
  object: RouteBodyInfo[]
  selects: Selects | null
  routesecure: boolean
  getter: Getter
  validator: Validator
}
interface Options {
  getter?: Getter
  optional?: boolean
  selects?: Selects
  type?: Function | [Function]
  routesecure?: boolean
}

export const RouteBody = <V>(opts?: Options, v?: Validator<V>) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    let typename: string = ''
    let object: RouteBodyInfo[] = []
    const explicit = opts?.type

    if (!explicit) typename = Reflect.getMetadata('design:type', target, name).name
    else {
      const arr = isArray(explicit)
      const expname = (arr ? explicit[0].name : explicit.name).toLowerCase()
      if (expname === 'array') typename = 'any[]'
      else if (btypes.includes(expname as any)) typename = arr ? `${expname}[]` : expname
      else {
        const expcls = arr ? explicit[0] : explicit
        typename = arr ? 'object[]' : 'object'
        getAllProperties(expcls).forEach(p => {
          const value = expcls.prototype[p] as RouteBodyInfo
          if (value.$body) object.push(value)
        })
      }
    }

    const type = typename.toLowerCase() as RouteBodyType
    if (!btypes.includes(type)) throw new Error(`@RouteBody(${name}) must be typeof ${btypes}\n`)
    const validator = v || (() => true)
    const getter = opts?.getter || (v => v)
    const get = (): RouteBodyInfo => ({
      $body: true,
      name,
      type,
      optional,
      object,
      selects: opts?.selects || null,
      routesecure: opts?.routesecure || false,
      getter,
      validator,
    })

    Object.defineProperty(target, name, { get })
  }
}
