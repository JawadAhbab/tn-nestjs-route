import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException, UseGuards, applyDecorators } from '@nestjs/common'; // prettier-ignore
import { Reflector } from '@nestjs/core'
import sha from 'crypto-js/sha256'
import { Request } from 'express'
import ms from 'ms'
import { AnyObject } from 'tn-typescript'
import { RouteInfo } from '../RouteInfo/RouteInfo'
const routekey = 'routesecure'

export const RouteSecureGuard = (route: RouteInfo) => {
  return applyDecorators(SetMetadata(routekey, route), UseGuards(Activate))
}

@Injectable()
class Activate implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const handles = [context.getHandler(), context.getClass()]
    const route = this.reflector.getAllAndOverride<RouteInfo>(routekey, handles)
    const req = context.switchToHttp().getRequest() as Request
    const { params = {} as AnyObject, query = {} as AnyObject } = req

    const rs = route.routesecure
    if (!rs) return true

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

    return true
  }
}
