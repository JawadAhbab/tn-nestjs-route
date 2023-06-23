import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { AnyObject } from 'tn-typescript'
import { routeFieldsEssentials } from './accessories/routeFieldsEssentials'
import { routeFieldsBodies } from './createFields/routeFieldsBodies'
import { routeFieldsFiles } from './createFields/routeFieldsFiles'
import { routeFieldsParams } from './createFields/routeFieldsParams'

export const RouteFields = createParamDecorator((_, ctx: ExecutionContext) => {
  const { params, body, files, route } = routeFieldsEssentials(ctx)
  const fields: AnyObject = {}
  routeFieldsParams(fields, params, route)
  routeFieldsBodies(fields, body, route)
  routeFieldsFiles(fields, files, route)
  return fields
})
