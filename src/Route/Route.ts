import { OptionLess } from 'tn-typescript'
export interface RouteCdnConfig {
  bunnycdn?: boolean
  bunnyperma?: boolean
  bunnysecure?: boolean
}

export const Route = (routebase: string, cdnconfig?: RouteCdnConfig) => {
  return (target: Function) => {
    const routecdnconfig: OptionLess<RouteCdnConfig> = {
      bunnycdn: cdnconfig?.bunnycdn || cdnconfig?.bunnyperma || cdnconfig?.bunnysecure || false,
      bunnyperma: cdnconfig?.bunnyperma || false,
      bunnysecure: cdnconfig?.bunnysecure || false,
    }

    target.prototype.$routebase = routebase
    target.prototype.$routecdnconfig = routecdnconfig
  }
}
