import { RouteSecureInfo } from '../../RouteField/RouteSecure'
export type RouteSecure = { name: string; timesafe: string | false; query: boolean } | false

export const routeInfoRouteSecure = (rsi: RouteSecureInfo): RouteSecure => {
  if (!rsi) return false

  return {
    name: rsi.name,
    timesafe: rsi.timesafe,
    query: rsi.query,
  }
}
