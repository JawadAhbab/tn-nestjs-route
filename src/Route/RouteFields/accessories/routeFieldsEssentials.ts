import { ExecutionContext, InternalServerErrorException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RouteInfo } from '../../RouteInfo/RouteInfo'
import { isArray } from 'tn-validate'
import { ObjectOf } from 'tn-typescript'
type Files = ObjectOf<Express.Multer.File[]>

export const routeFieldsEssentials = (ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as Request
  const { params = {}, body = {}, files = {}, query = {} } = req
  const reflector = new Reflector()
  const handler = ctx.getHandler()
  const path = reflector.get<string>('path', handler)
  const controller = ctx.getClass() as Function
  const routes = controller.prototype.$routes as RouteInfo[]
  if (!isArray(routes)) throw new InternalServerErrorException('@Route() setup has faults')
  const route = routes.find(route => route.$route && route.route === path)
  if (!route) throw new InternalServerErrorException('@Route() setup has faults')
  return { params, body, query, files: files as Files, route }
}
