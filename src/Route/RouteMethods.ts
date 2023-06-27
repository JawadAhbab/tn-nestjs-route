import { Get, Post, UseInterceptors, applyDecorators } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { isArray } from 'tn-validate'
import { RouteBodyType } from './RouteField/RouteBody'
import { createRouteInfo } from './RouteInfo'
type Method = (path?: string | string[]) => MethodDecorator

export const RouteGet = (routecls: Function, resultcls?: Function) => createDecor(Get, routecls, resultcls) // prettier-ignore
export const RoutePost = (routecls: Function, resultcls?: Function) => createDecor(Post, routecls, resultcls) // prettier-ignore

const createDecor = (Method: Method, routecls: Function, resultcls?: Function) => {
  const routeinfo = createRouteInfo(routecls, resultcls)
  const route = routeinfo.route
  const routeDecor = (target: any) => {
    if (!isArray(target.$routes)) target.$routes = []
    routeinfo.name = target.name
    target.$routes.push(routeinfo)
  }

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
