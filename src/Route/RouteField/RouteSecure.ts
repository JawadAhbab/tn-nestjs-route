type TimeUnit = 's' | 'm' | 'h' | 'd' | 'y'
type Options = { timesafe?: `${string}${TimeUnit}` | false }
export interface RouteSecureInfo {
  $secure: true
  name: string
  secret: string
  timesafe: string | false
}

export const RouteSecure = (secret: string, opts?: Options) => {
  return (target: any, name: string) => {
    const get = (): RouteSecureInfo => ({
      $secure: true,
      name,
      secret,
      timesafe: opts?.timesafe || false,
    })
    Object.defineProperty(target, name, { get })
  }
}
