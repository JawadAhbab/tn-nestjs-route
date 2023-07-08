import { RouteParamInfo } from '../../RouteField/RouteParam'
import { RouteSecureInfo } from '../../RouteField/RouteSecure'
interface Props {
  routebase: string
  params: RouteParamInfo[]
  rsi: RouteSecureInfo
}

export const routeInfoRoute = ({ routebase, params, rsi }: Props) => {
  const routearr = [routebase, ...params.map(({ name }) => `:${name}`)]
  if (rsi && !rsi.query) routearr.push(`:${rsi.name}`)

  return routearr.join('/').replace(/[\\\/]+/g, '/')
}
