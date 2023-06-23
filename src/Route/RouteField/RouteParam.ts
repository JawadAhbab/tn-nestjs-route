const ptypes = ['string', 'number', 'boolean'] as const
type ParamType = (typeof ptypes)[number]
type Validator<V = any> = (value: V) => boolean
export interface RouteParamInfo {
  $param: true
  name: string
  type: ParamType
  optional: boolean
  validator: Validator
}
interface Options {
  type?: StringConstructor | NumberConstructor | BooleanConstructor
  optional?: boolean
}

export const RouteParam = <V>(opts?: Options, v?: Validator<V>) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    const typename = opts?.type?.name || Reflect.getMetadata('design:type', target, name).name
    const type = typename.toLowerCase() as ParamType
    if (!ptypes.includes(type)) throw new Error(`@RouteParam(${name}) must be typeof ${ptypes}\n`)
    const validator = v || (() => true)
    const getter = (): RouteParamInfo => ({ $param: true, name, type, optional, validator })
    Object.defineProperty(target, name, { get: getter })
  }
}
