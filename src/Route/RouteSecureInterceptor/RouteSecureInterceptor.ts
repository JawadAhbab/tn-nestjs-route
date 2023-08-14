import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common'; // prettier-ignore
import sha from 'crypto-js/sha256'
import { Request } from 'express'
import ms from 'ms'
import { Observable } from 'rxjs'
import { AnyObject } from 'tn-typescript'
import { RouteInfo } from '../RouteInfo/RouteInfo'

@Injectable()
export class RouteSecureInterceptor implements NestInterceptor {
  constructor(private readonly route: RouteInfo) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as Request
    const { params = {} as AnyObject, query = {} as AnyObject, body = {} as AnyObject } = req
    const rs = this.route.routesecure
    if (!rs) return next.handle()

    const token: string = rs.query ? query[rs.name] : params[rs.name]
    if (!token) throw new UnauthorizedException()

    const secret = this.route.getRouteSecureSecret()
    const checks: string[] = []
    this.route.params.forEach(({ name }) => checks.push(params[name]))
    this.route.queries.forEach(({ name, routesecure }) => {
      if (!routesecure) return
      const val = query[name]
      const isnull = val === null || val === undefined
      if (!isnull) checks.push(val)
    })
    this.route.bodies.forEach(({ name, routesecure }) => {
      if (!routesecure) return
      const val = body[name]
      const isnull = val === null || val === undefined
      if (!isnull) checks.push(JSON.stringify(val))
    })
    const checkstr = checks.join('/')

    if (rs.timesafe) {
      const [expstr, hash] = token.split('.')
      const remain = +expstr - new Date().getTime()
      if (remain < 0 || remain > ms(rs.timesafe)) throw new UnauthorizedException()
      const hashmatch = sha(checkstr + expstr + secret).toString()
      if (hash !== hashmatch) throw new UnauthorizedException()
    } else {
      const hashmatch = sha(checkstr + secret).toString()
      if (token !== hashmatch) throw new UnauthorizedException()
    }

    return next.handle()
  }
}
