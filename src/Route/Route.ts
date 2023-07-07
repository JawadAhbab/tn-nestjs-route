import { OptionLess } from 'tn-typescript'
export interface RouteCdnConfig {
  cdn?: boolean
  perma?: boolean
  secure?: boolean
}

export const Route = (routebase: string, cdnconfig?: RouteCdnConfig) => {
  return (target: Function) => {
    const routecdnconfig: OptionLess<RouteCdnConfig> = {
      cdn: cdnconfig?.cdn || cdnconfig?.perma || cdnconfig?.secure || false,
      perma: cdnconfig?.perma || false,
      secure: cdnconfig?.secure || false,
    }

    target.prototype.$routebase = routebase
    target.prototype.$routecdnconfig = routecdnconfig
  }
}
