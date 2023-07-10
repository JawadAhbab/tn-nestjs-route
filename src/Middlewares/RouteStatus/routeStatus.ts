import ms from 'pretty-ms'
import { AnyObject, ObjectOf } from 'tn-typescript'
// TODO remove all ms() when visual status page is ready

class Status {
  public route: string
  public count = 0
  public cputime = 0
  private maxtime = 0
  private mintime = Infinity
  private statusCodes: ObjectOf<number> = {}
  constructor(route: string) {
    this.route = route
  }

  public saveStatus(time: number, statusCode: number) {
    this.count += 1
    this.cputime += time
    this.mintime = Math.min(this.mintime, time)
    this.maxtime = Math.max(this.maxtime, time)
    if (!this.statusCodes[statusCode]) this.statusCodes[statusCode] = 0
    this.statusCodes[statusCode] += 1
  }

  public get average() {
    return Math.round(this.cputime / this.count)
  }

  public get summery() {
    return {
      count: this.count,
      mintime: this.mintime + 'ms',
      average: this.average + 'ms',
      maxtime: this.maxtime + 'ms',
      cputime: ms(this.cputime, { verbose: true, secondsDecimalDigits: 0 }),
      statusCodes: this.statusCodes,
    }
  }
}

export class RouteStatus {
  private routes: ObjectOf<Status> = {}

  public saveStatus(routename: string, time: number, statusCode: number) {
    const route = this.routes[routename]
    if (!route) this.routes[routename] = new Status(routename)
    this.routes[routename].saveStatus(time, statusCode)
  }

  public createSummery() {
    const rs = Object.entries(this.routes).map(([_, route]) => route)
    rs.sort((a, b) => b.count - a.count)

    const counts = rs.reduce((a, b) => a + b.count, 0)
    const cputimes = rs.reduce((a, b) => a + b.cputime, 0)
    const cputime = ms(cputimes, { verbose: true, secondsDecimalDigits: 0 })
    const average = Math.round(cputimes / counts) + 'ms'
    const routes: AnyObject = {}
    rs.forEach(route => (routes[route.route] = route.summery))
    return { counts, average, cputime, routes }
  }
}

export const routeStatus = new RouteStatus()
