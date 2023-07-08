import { BadRequestException } from '@nestjs/common'
import { AnyObject } from 'tn-typescript'
import { RouteInfo } from '../../RouteInfo/RouteInfo'
const queryerr = (name: string) => new BadRequestException(`Invalid query: ${name}`)

export const routeFieldsQueries = (fields: AnyObject, query: AnyObject, route: RouteInfo) => {
  route.queries.forEach(({ name, type, optional, selects, validator, getter }) => {
    let value: string | number | boolean | undefined
    const strval = query[name]
    if (optional && strval === '-') return
    else if (type === 'string') value = strval
    else if (type === 'boolean') {
      if (strval === 'true') value = true
      else if (strval === 'false') value = false
      else throw queryerr(name)
    } else {
      value = +strval
      if (isNaN(value)) throw queryerr(name)
    }

    if (selects && !(selects as any[]).includes(value)) throw queryerr(name)
    if (!validator(value)) throw queryerr(name)
    fields[name] = getter(value)
  })
}
