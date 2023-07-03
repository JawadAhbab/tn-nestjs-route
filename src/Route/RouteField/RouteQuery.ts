import { Getter, Validator } from './accessories/RouteFieldTypes'
const qtypes = ['string', 'number', 'boolean'] as const
type QueryType = (typeof qtypes)[number]
export interface RouteQueryInfo {
  $query: true
  name: string
  type: QueryType
  getter: Getter
  optional: boolean
  validator: Validator
}
interface Options {
  getter?: Getter
  type?: StringConstructor | NumberConstructor | BooleanConstructor
  optional?: boolean
}

export const RouteQuery = <V>(opts?: Options, v?: Validator<V>) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    const typename = opts?.type?.name || Reflect.getMetadata('design:type', target, name).name
    const type = typename.toLowerCase() as QueryType
    if (!qtypes.includes(type)) throw new Error(`@RouteQuery(${name}) must be typeof ${qtypes}\n`)
    const validator = v || (() => true)
    const getter = opts?.getter || (v => v)
    const get = (): RouteQueryInfo => ({ $query: true, name, type, optional, validator, getter })
    Object.defineProperty(target, name, { get })
  }
}
