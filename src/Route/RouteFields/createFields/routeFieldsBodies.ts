import { BadRequestException } from '@nestjs/common'
import { AnyObject } from 'tn-typescript'
import { isArray, isBoolArr, isBoolean, isNumArr, isNumber, isObject, isStrArr, isString } from 'tn-validate'; // prettier-ignore
import { RouteInfo } from '../../RouteInfo'
const bodyerr = (name: string) => new BadRequestException(`Invalid body: ${name}`)

export const routeFieldsBodies = (fields: AnyObject, body: AnyObject, route: RouteInfo) => {
  const typecorrection = !!route.files.length
  route.bodies.forEach(({ name, type, optional, validator }) => {
    const prevalue = body[name]
    const voidvalue = prevalue === undefined || prevalue === null
    if (!optional && voidvalue) throw bodyerr(name)
    if (voidvalue) return

    let value = prevalue
    if (typecorrection) {
      if (type === 'boolean') {
        if (prevalue === 'true') value = true
        else if (prevalue === 'false') value = false
        else throw bodyerr(name)
      } else if (type === 'number') {
        value = +prevalue
        if (isNaN(value)) throw bodyerr(name)
      }
    }

    if (type === 'string' && !isString(value)) throw bodyerr(name)
    if (type === 'number' && !isNumber(value)) throw bodyerr(name)
    if (type === 'boolean' && !isBoolean(value)) throw bodyerr(name)
    if (type === 'string[]' && !isStrArr(value)) throw bodyerr(name)
    if (type === 'number[]' && !isNumArr(value)) throw bodyerr(name)
    if (type === 'boolean[]' && !isBoolArr(value)) throw bodyerr(name)
    if (type === 'any[]' && !isArray(value)) throw bodyerr(name)
    if (type === 'object' && !isObject(value)) throw bodyerr(name)
    if (!validator(value)) throw bodyerr(name)
    fields[name] = value
  })
}
