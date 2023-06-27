import { Get, Post, UseInterceptors, applyDecorators } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { isArray } from 'tn-validate'
import { RouteBodyType } from './RouteField/RouteBody'
import { RouteMethod, createRouteInfo } from './RouteInfo'
type ResultClass = Function | BufferConstructor | StringConstructor

export const RouteGet = (routecls: Function, resultcls?: ResultClass) => createDecor('GET', routecls, resultcls) // prettier-ignore
export const RoutePost = (routecls: Function, resultcls?: ResultClass) => createDecor('POST', routecls, resultcls) // prettier-ignore

const createDecor = (method: RouteMethod, routecls: Function, resultcls?: ResultClass) => {
  const routeinfo = createRouteInfo(method, routecls, resultcls)
  const route = routeinfo.route
  const routeDecor = (target: any) => {
    if (!isArray(target.$routes)) target.$routes = []
    target.$routes.push(routeinfo)
  }

  const Method = method === 'GET' ? Get : Post
  const decors = [routeDecor, Method(route)]
  if (routeinfo.files.length) {
    const multer: MulterField[] = routeinfo.files.map(file => ({ name: file.name }))
    decors.push(UseInterceptors(FileFieldsInterceptor(multer)))
    const acc: RouteBodyType[] = ['string', 'number', 'boolean']
    routeinfo.bodies.forEach(({ type, name }) => {
      if (acc.includes(type)) return
      throw new Error(`You are using @RouteFile() so @RouteBody(${name}) must be typeof ${acc}\n`)
    })
  }

  return applyDecorators(...decors)
}
