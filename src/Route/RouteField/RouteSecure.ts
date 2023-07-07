export interface RouteSecureInfo {
  $secure: true
  name: string
  secret: string
}

export const RouteSecure = (secret: string) => {
  return (target: any, name: string) => {
    const get = (): RouteSecureInfo => ({ $secure: true, name, secret })
    Object.defineProperty(target, name, { get })
  }
}
