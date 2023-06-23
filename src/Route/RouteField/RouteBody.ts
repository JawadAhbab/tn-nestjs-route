import { isArray } from 'tn-validate'
const btypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'any[]'] as const // prettier-ignore
export type RouteBodyType = (typeof btypes)[number]
type Validator<V = any> = (value: V) => boolean
export interface RouteBodyInfo {
  $body: true
  name: string
  type: RouteBodyType
  optional: boolean
  validator: Validator
}
interface Options {
  optional?: boolean
  type?:
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ObjectConstructor
    | ArrayConstructor
    | [StringConstructor]
    | [NumberConstructor]
    | [BooleanConstructor]
}

export const RouteBody = <V>(opts?: Options, v?: Validator<V>) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    let typename: string = ''
    const explicit = opts?.type
    if (explicit) {
      if (isArray(explicit)) typename = `${explicit[0].name}[]`
      else typename = explicit.name === 'Array' ? 'any[]' : explicit.name
    } else typename = Reflect.getMetadata('design:type', target, name).name
    const type = typename.toLowerCase() as RouteBodyType
    if (!btypes.includes(type)) throw new Error(`@RouteBody(${name}) must be typeof ${btypes}\n`)
    const validator = v || (() => true)
    const getter = (): RouteBodyInfo => ({ $body: true, name, type, optional, validator })
    Object.defineProperty(target, name, { get: getter })
  }
}
