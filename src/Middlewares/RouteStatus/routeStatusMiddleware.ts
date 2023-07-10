import { RequestHandler } from 'express'
import onHeaders from 'on-headers'
import { routeStatus } from './RouteStatus'

export const routeStatusMiddleware: RequestHandler = (req, res, next) => {
  const stime = new Date().getTime()
  onHeaders(res, () => {
    const etime = new Date().getTime()
    const time = etime - stime
    const routename = req.route?.path || 'unknown'
    routeStatus.saveStatus(routename, time)
  })
  next()
}
