import { isArray } from 'tn-validate'
import { RouteInfo } from './RouteInfo'

export const routeSchemaCreator = (controllers: Function[]) => {
  return controllers
    .map(controller => {
      const routes = (controller.prototype as any).$routes as RouteInfo[]
      if (isArray(routes)) return routes.filter(r => r.$route)
    })
    .filter(i => i)
    .flat()
}
