import { ExecutionContext, InternalServerErrorException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RouteInfo } from '../../RouteInfo'
import { isArray } from 'tn-validate'
import { ObjectOf } from 'tn-typescript'
type Files = ObjectOf<Express.Multer.File[]>

export const routeFieldsEssentials = (ctx: ExecutionContext) => {
  const { params, body, files } = ctx.switchToHttp().getRequest() as Request
  const reflector = new Reflector()
  const handler = ctx.getHandler()
  const path = reflector.get<string>('path', handler)
  const controller = ctx.getClass() as Function
  const routes = controller.prototype.$routes as RouteInfo[]
  if (!isArray(routes)) throw new InternalServerErrorException('@Route() setup has faults')
  const route = routes.find(route => route.$route && route.route === path)
  if (!route) throw new InternalServerErrorException('@Route() setup has faults')
  return { params, body, files: files as Files, route }
}
