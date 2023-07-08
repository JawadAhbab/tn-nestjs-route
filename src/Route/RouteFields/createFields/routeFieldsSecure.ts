import { UnauthorizedException } from '@nestjs/common'
import sha from 'crypto-js/sha256'
import ms from 'ms'
import { AnyObject } from 'tn-typescript'
import { RouteInfo } from '../../RouteInfo/RouteInfo'

export const routeFieldsSecure = (query: AnyObject, params: AnyObject, route: RouteInfo) => {
  const rs = route.routesecure
  if (!rs) return

  const token: string = rs.query ? query[rs.name] : params[rs.name]
  if (!token) throw new UnauthorizedException()

  const paramurl = route.params.map(({ name }) => params[name]).join('/')
  const secret = route.getRouteSecureSecret()

  if (rs.timesafe) {
    const [expstr, hash] = token.split('.')
    const remain = +expstr - new Date().getTime()
    if (remain <= 0 || remain >= ms(rs.timesafe)) throw new UnauthorizedException()
    const hashmatch = sha(paramurl + expstr + secret).toString()
    if (hash !== hashmatch) throw new UnauthorizedException()
  } else {
    const hashmatch = sha(paramurl + secret).toString()
    if (token !== hashmatch) throw new UnauthorizedException()
  }
}
