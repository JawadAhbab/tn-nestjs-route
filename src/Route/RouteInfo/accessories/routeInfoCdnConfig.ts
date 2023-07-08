import { OptionLess } from 'tn-typescript'
import { RouteCdnOptions } from '../../Route'
import { RouteParamInfo } from '../../RouteField/RouteParam'
type BunnySecureRoute = { tokenroute: string; params: RouteParamInfo[] }
export type RouteCdnConfig = OptionLess<RouteCdnOptions> & { secureroute?: BunnySecureRoute }

export const routeInfoCdnConfig = (routecls: Function, params: RouteParamInfo[]) => {
  const cdnopts = routecls.prototype.$routecdnopts as OptionLess<RouteCdnOptions>

  let routebase = routecls.prototype.$routebase as string
  if (cdnopts.bunnysecure) routebase = '/-secure-/' + routebase
  if (cdnopts.bunnyperma) routebase = '/-perma-/' + routebase

  let secureroute: undefined | BunnySecureRoute
  if (cdnopts.bunnysecure) {
    let lock = false
    const tokenparams: RouteParamInfo[] = []
    params.forEach(param => {
      if (!param.bunnysecure) return (lock = true)
      if (lock) throw new Error('@RouteParam() bunnysecure:true must be in proper sequence\n')
      if (param.optional) throw new Error('@RouteParam() bunnysecure:true can not be optional\n')
      tokenparams.push(param)
    })

    const routearr = [routebase, ...tokenparams.map(({ name }) => `:${name}`)].join('/')
    const tokenroute = `/${routearr}/`.replace(/[\\\/]+/g, '/')
    secureroute = { tokenroute, params: tokenparams }
  }

  const cdnconfig: RouteCdnConfig = { ...cdnopts, secureroute }
  return { routebase, cdnconfig }
}
