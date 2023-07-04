import axios from 'axios'
import * as fs from 'fs-extra'
import * as path from 'path'
import { RouteInfo } from '../Route/RouteInfo'
import { templateInterfaces } from './templates/templateInterfaces'
import { templateBasics } from './templates/templateBasics'
import { templateRoute } from './templates/templateRoute'
interface RouteConfig {
  site: string
  schema: string
  outpath: string
  loggerImport: string
  loggerMethod: string
}

const configpath = path.join(process.cwd(), 'routes.json')
const configs: RouteConfig[] = fs.readJsonSync(configpath)
configs.forEach(config => createRouteFile(config))

async function createRouteFile(config: RouteConfig) {
  const { site, schema, outpath, loggerImport, loggerMethod } = config
  if (!site || !schema || !outpath) throw new Error('Malformed config file\n')
  const routesinfo: RouteInfo[] = (await axios.get(schema, { responseType: 'json' })).data
  let outdata = templateInterfaces + templateBasics(site, loggerImport, loggerMethod)
  routesinfo.forEach(routeinfo => (outdata += templateRoute(routeinfo)))
  fs.outputFileSync(path.join(process.cwd(), outpath), outdata)
}