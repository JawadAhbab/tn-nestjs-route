import { BadRequestException } from '@nestjs/common'
import { AnyObject } from 'tn-typescript'
import { isArray, isBoolArr, isBoolean, isNumArr, isNumber, isObject, isStrArr, isString } from 'tn-validate'; // prettier-ignore
import { RouteBodyInfo } from '../../RouteField/RouteBody'
import { RouteInfo } from '../../RouteInfo'
const bodyerr = (name: string, prefix: string[] = []) => {
  const prestr = prefix.map(p => `${p}.`).join('')
  return new BadRequestException(`Invalid body: ${prestr}${name}`)
}

export const routeFieldsBodies = (fields: AnyObject, body: AnyObject, route: RouteInfo) => {
  const typecorrection = !!route.files.length
  route.bodies.forEach(bodyinfo => {
    const { name, type } = bodyinfo
    const prevalue = body[name]
    const voidvalue = prevalue === undefined || prevalue === null

    let value = prevalue
    if (typecorrection && !voidvalue) {
      if (type === 'boolean') {
        if (prevalue === 'true') value = true
        else if (prevalue === 'false') value = false
        else throw bodyerr(name)
      } else if (type === 'number') {
        value = +prevalue
        if (isNaN(value)) throw bodyerr(name)
      }
    }

    fields[name] = getValue(bodyinfo, value)
  })
}

const getValue = (bodyinfo: RouteBodyInfo, value: any, prefix: string[] = []) => {
  const { name, optional, type, object, selects, validator, getter } = bodyinfo
  const voidvalue = value === undefined || value === null
  if (!optional && voidvalue) throw bodyerr(name, prefix)
  if (voidvalue) return

  if (type === 'string' && !isString(value)) throw bodyerr(name, prefix)
  if (type === 'number' && !isNumber(value)) throw bodyerr(name, prefix)
  if (type === 'boolean' && !isBoolean(value)) throw bodyerr(name, prefix)
  if (type === 'string[]' && !isStrArr(value)) throw bodyerr(name, prefix)
  if (type === 'number[]' && !isNumArr(value)) throw bodyerr(name, prefix)
  if (type === 'boolean[]' && !isBoolArr(value)) throw bodyerr(name, prefix)
  if (type === 'any[]' && !isArray(value)) throw bodyerr(name, prefix)
  if (type === 'object[]' && !isArray(value)) throw bodyerr(name, prefix)
  if (type === 'object' && !isObject(value)) throw bodyerr(name, prefix)
  if (selects && (selects as any[]).includes(value)) throw bodyerr(name)
  if (!validator(value)) throw bodyerr(name, prefix)

  if (type !== 'object' && type !== 'object[]') return getter(value)
  const arr = type === 'object[]'
  const arrvalue: any[] = arr ? value : [value]
  const retvalue = arrvalue.map(values => {
    const value: AnyObject = {}
    object.forEach(nextbodyinfo => {
      const { name: nextname } = nextbodyinfo
      const nextvalue = values[nextname]
      value[nextname] = getValue(nextbodyinfo, nextvalue, [...prefix, name])
    })
    return getter(value)
  })

  return getter(arr ? retvalue : retvalue[0])
}
