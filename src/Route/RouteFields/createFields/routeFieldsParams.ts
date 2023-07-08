import { BadRequestException } from '@nestjs/common'
import { AnyObject } from 'tn-typescript'
import { RouteInfo } from '../../RouteInfo/RouteInfo'
const paramerr = (name: string) => new BadRequestException(`Invalid parameter: ${name}`)

export const routeFieldsParams = (fields: AnyObject, params: AnyObject, route: RouteInfo) => {
  route.params.forEach(({ name, type, optional, selects, validator, getter }) => {
    let value: string | number | boolean | undefined
    const strval = params[name]
    if (optional && strval === '-') return
    else if (type === 'string') value = strval
    else if (type === 'boolean') {
      if (strval === 'true') value = true
      else if (strval === 'false') value = false
      else throw paramerr(name)
    } else {
      value = +strval
      if (isNaN(value)) throw paramerr(name)
    }

    if (selects && !(selects as any[]).includes(value)) throw paramerr(name)
    if (!validator(value)) throw paramerr(name)
    fields[name] = getter(value)
  })
}
