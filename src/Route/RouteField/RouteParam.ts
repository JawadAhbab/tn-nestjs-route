import { Getter, Validator } from './accessories/RouteFieldTypes'
const ptypes = ['string', 'number', 'boolean'] as const
type ParamType = (typeof ptypes)[number]
export interface RouteParamInfo {
  $param: true
  name: string
  type: ParamType
  optional: boolean
  getter: Getter
  validator: Validator
}
interface Options {
  getter?: Getter
  type?: StringConstructor | NumberConstructor | BooleanConstructor
  optional?: boolean
}

export const RouteParam = <V>(opts?: Options, v?: Validator<V>) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    const typename = opts?.type?.name || Reflect.getMetadata('design:type', target, name).name
    const type = typename.toLowerCase() as ParamType
    type Getter = (value: any) => any
    if (!ptypes.includes(type)) throw new Error(`@RouteParam(${name}) must be typeof ${ptypes}\n`)
    const validator = v || (() => true)
    const getter = opts?.getter || (v => v)
    const get = (): RouteParamInfo => ({ $param: true, name, type, optional, validator, getter })
    Object.defineProperty(target, name, { get })
  }
}
