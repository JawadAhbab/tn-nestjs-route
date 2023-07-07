import { UnauthorizedException } from '@nestjs/common'
import md5 from 'crypto-js/md5'
import ms from 'ms'
import { AnyObject } from 'tn-typescript'
import { RouteInfo } from '../../RouteInfo'

export const routeFieldsSecure = (query: AnyObject, route: RouteInfo) => {
  if (!route.secure) return

  const token = query[route.secure.name] as string
  if (!token) throw new UnauthorizedException()

  const [expstr, hash] = token.split('.')
  const remain = +expstr - new Date().getTime()
  if (remain <= 0 || remain >= ms('2m')) throw new UnauthorizedException()

  const hashmatch = md5(expstr + route.getSecureSecret()).toString()
  if (hash !== hashmatch) throw new UnauthorizedException()
}
