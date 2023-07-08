import { RouteResultInfo, RouteResultJson } from '../../RouteField/RouteResult'
import { getAllProperties } from '../../accessories/getAllProperties'

export const routeInfoResults = (resultcls?: Function) => {
  let results: RouteResultInfo = 'String'

  if (resultcls?.name === 'String') results = 'String'
  else if (resultcls?.name === 'Buffer') results = 'Buffer'
  else if (resultcls) {
    const resjson: RouteResultJson[] = []
    getAllProperties(resultcls).forEach(p => {
      const result = resultcls.prototype[p] as RouteResultJson
      if (result.$result) return resjson.push(result)
    })
    results = resjson
  }

  return results
}
