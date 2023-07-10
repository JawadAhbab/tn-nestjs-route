import { RequestHandler } from 'express'
import onHeaders from 'on-headers'
import { statusRoutes } from './StatusRoutes/StatusRoutes'

export const routeStatus: RequestHandler = (req, res, next) => {
  const stime = new Date().getTime()
  onHeaders(res, () => {
    const etime = new Date().getTime()
    const time = etime - stime
    const routename = req.route?.path || 'unknown'
    statusRoutes.saveStatus(routename, time)
  })
  next()
}
