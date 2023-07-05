import { Getter, Selects, Validator } from './accessories/RouteFieldTypes'
const ptypes = ['string', 'number', 'boolean'] as const
type ParamType = (typeof ptypes)[number]
export interface RouteParamInfo {
  $param: true
  index?: number
  name: string
  type: ParamType
  optional: boolean
  selects: Selects | null
  getter: Getter
  validator: Validator
}
interface Options {
  getter?: Getter
  optional?: boolean
  selects?: Selects
  type?: StringConstructor | NumberConstructor | BooleanConstructor
}

export const RouteParam = <V>(opts?: Options, v?: Validator<V>) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    const typename = opts?.type?.name || Reflect.getMetadata('design:type', target, name).name
    const type = typename.toLowerCase() as ParamType
    if (!ptypes.includes(type)) throw new Error(`@RouteParam(${name}) must be typeof ${ptypes}\n`)
    const validator = v || (() => true)
    const getter = opts?.getter || (v => v)
    const get = (): RouteParamInfo => ({
      $param: true,
      name,
      type,
      optional,
      selects: opts?.selects || null,
      validator,
      getter,
    })

    Object.defineProperty(target, name, { get })
  }
}

export const RouteIndexParam = <V>(index: number, opts?: Options, v?: Validator<V>) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    const typename = opts?.type?.name || Reflect.getMetadata('design:type', target, name).name
    const type = typename.toLowerCase() as ParamType
    if (!ptypes.includes(type)) throw new Error(`@RouteIndexParam(${name}) must be typeof ${ptypes}\n`) // prettier-ignore
    const validator = v || (() => true)
    const getter = opts?.getter || (v => v)
    const get = (): RouteParamInfo => ({
      $param: true,
      index,
      name,
      type,
      optional,
      selects: opts?.selects || null,
      validator,
      getter,
    })

    Object.defineProperty(target, name, { get })
  }
}
