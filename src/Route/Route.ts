export const Route = (routebase: string) => {
  return (target: Function) => {
    target.prototype.$routebase = routebase
  }
}
