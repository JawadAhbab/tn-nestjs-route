import { ObjectOf } from 'tn-typescript'
interface Summery {
  count: number
  ave: number
  min: number
  max: number
}

class StatusRoute {
  public route: string
  public count = 0
  private timesum = 0
  private mintime = Infinity
  private maxtime = 0
  constructor(route: string) {
    this.route = route
  }

  public saveStatus(time: number) {
    this.count += 1
    this.timesum += time
    this.mintime = Math.min(this.mintime, time)
    this.maxtime = Math.max(this.maxtime, time)
  }

  public get ave() {
    return Math.round(this.timesum / this.count)
  }

  public get summery(): Summery {
    return { count: this.count, ave: this.ave, min: this.mintime, max: this.maxtime }
  }
}

export class StatusRoutes {
  private routes: ObjectOf<StatusRoute> = {}

  public saveStatus(routename: string, time: number) {
    const route = this.routes[routename]
    if (!route) this.routes[routename] = new StatusRoute(routename)
    this.routes[routename].saveStatus(time)
  }

  public createSummery(sort: 'count' | 'time' = 'count') {
    const summery: ObjectOf<Summery> = {}
    const routes = Object.entries(this.routes).map(([_, route]) => route)
    routes.sort((a, b) => (sort === 'count' ? b.count - a.count : b.ave - a.ave))
    routes.forEach(route => (summery[route.route] = route.summery))
    return summery
  }
}

export const statusRoutes = new StatusRoutes()
