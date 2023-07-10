import ms from 'pretty-ms'
import { AnyObject, ObjectOf } from 'tn-typescript'

class Status {
  public route: string
  public count = 0
  public cputime = 0
  private maxtime = 0
  private mintime = Infinity
  constructor(route: string) {
    this.route = route
  }

  public saveStatus(time: number) {
    this.count += 1
    this.cputime += time
    this.mintime = Math.min(this.mintime, time)
    this.maxtime = Math.max(this.maxtime, time)
  }

  public get ave() {
    return Math.round(this.cputime / this.count)
  }

  public get summery() {
    return {
      count: this.count,
      time: `${this.mintime}ms - ${this.ave}ms - ${this.maxtime}ms`,
      cputime: ms(this.cputime, { verbose: true, secondsDecimalDigits: 0 }),
    }
  }
}

export class RouteStatus {
  private routes: ObjectOf<Status> = {}

  public saveStatus(routename: string, time: number) {
    const route = this.routes[routename]
    if (!route) this.routes[routename] = new Status(routename)
    this.routes[routename].saveStatus(time)
  }

  public createSummery(sort: 'count' | 'ave' | 'cpu' = 'count') {
    const rs = Object.entries(this.routes).map(([_, route]) => route)
    if (sort === 'count') rs.sort((a, b) => b.count - a.count)
    else if (sort === 'ave') rs.sort((a, b) => b.ave - a.ave)
    else if (sort === 'cpu') rs.sort((a, b) => b.cputime - a.cputime)

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
