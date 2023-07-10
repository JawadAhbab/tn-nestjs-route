import { RequestHandler } from 'express'
import onHeaders from 'on-headers'
import { routeStatus } from './RouteStatus'
interface Options {
  excludes?: string[]
}

export const routeStatusMiddleware = (opts: Options = {}): RequestHandler => {
  const { excludes = [] } = opts

  return (req, res, next) => {
    const stime = new Date().getTime()
    onHeaders(res, () => {
      const etime = new Date().getTime()
      const time = etime - stime
      const routename = req.route?.path || 'unknown'
      if (!excludes.includes(routename)) routeStatus.saveStatus(routename, time)
    })
    next()
  }
}
