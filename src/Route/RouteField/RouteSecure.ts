import { TimeString } from '../accessories/TimeString'
type Options = { timesafe?: TimeString | false; query?: boolean }
export interface RouteSecureInfo {
  $secure: true
  name: string
  secret: string
  timesafe: string | false
  query: boolean
}

export const RouteSecure = (secret: string, opts?: Options) => {
  return (target: any, name: string) => {
    const get = (): RouteSecureInfo => ({
      $secure: true,
      name,
      secret,
      timesafe: opts?.timesafe || false,
      query: opts?.query || false,
    })
    Object.defineProperty(target, name, { get })
  }
}
