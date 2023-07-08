import { OptionLess } from 'tn-typescript'
import { TimeString } from './accessories/TimeString'
export interface RouteCdnOptions {
  bunnycdn?: boolean
  bunnyperma?: boolean
  bunnysecure?: false | TimeString
}

export const Route = (routebase: string, cdnopts?: RouteCdnOptions) => {
  return (target: Function) => {
    const routecdnopts: OptionLess<RouteCdnOptions> = {
      bunnycdn: cdnopts?.bunnycdn || cdnopts?.bunnyperma || !!cdnopts?.bunnysecure || false,
      bunnyperma: cdnopts?.bunnyperma || false,
      bunnysecure: cdnopts?.bunnysecure || false,
    }

    target.prototype.$routebase = routebase
    target.prototype.$routecdnopts = routecdnopts
  }
}
