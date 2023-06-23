import { isArray } from 'tn-validate'
const rtypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'any[]'] as const // prettier-ignore
export type RouteResultType = (typeof rtypes)[number]
export interface RouteResultInfo {
  $result: true
  name: string
  type: RouteResultType
  optional: boolean
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

export const RouteResult = (opts?: Options) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    let typename: string = ''
    const explicit = opts?.type
    if (explicit) {
      if (isArray(explicit)) typename = `${explicit[0].name}[]`
      else typename = explicit.name === 'Array' ? 'any[]' : explicit.name
    } else typename = Reflect.getMetadata('design:type', target, name).name
    const type = typename.toLowerCase() as RouteResultType
    if (!rtypes.includes(type)) throw new Error(`@RouteResult(${name}) must be typeof ${rtypes}\n`)
    const getter = (): RouteResultInfo => ({ $result: true, name, type, optional })
    Object.defineProperty(target, name, { get: getter })
  }
}
