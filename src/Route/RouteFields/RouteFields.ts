import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { AnyObject } from 'tn-typescript'
import { routeFieldsEssentials } from './accessories/routeFieldsEssentials'
import { routeFieldsBodies } from './createFields/routeFieldsBodies'
import { routeFieldsFiles } from './createFields/routeFieldsFiles'
import { routeFieldsParams } from './createFields/routeFieldsParams'
import { routeFieldsQueries } from './createFields/routeFieldsQueries'

export const RouteFields = createParamDecorator((_, ctx: ExecutionContext) => {
  const { params, body, query, files, route } = routeFieldsEssentials(ctx)
  const fields: AnyObject = {}
  routeFieldsParams(fields, params, route)
  routeFieldsQueries(fields, query, route)
  routeFieldsBodies(fields, body, route)
  routeFieldsFiles(fields, files, route)
  return fields
})
