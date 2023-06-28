const qtypes = ['string', 'number', 'boolean'] as const
type QueryType = (typeof qtypes)[number]
type Validator<V = any> = (value: V) => boolean
export interface RouteQueryInfo {
  $query: true
  name: string
  type: QueryType
  optional: boolean
  validator: Validator
}
interface Options {
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
    const getter = (): RouteQueryInfo => ({ $query: true, name, type, optional, validator })
    Object.defineProperty(target, name, { get: getter })
  }
}
