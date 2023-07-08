export const templateInterfaces = `
const qtypes = ['string', 'number', 'boolean'] as const
const ptypes = ['string', 'number', 'boolean'] as const
const btypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore
const rtypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore
const filetypes = ['file', 'file[]'] as const
type RouteMethod = 'GET' | 'POST'
type FileType = (typeof filetypes)[number]
type QueryType = (typeof qtypes)[number]
type ParamType = (typeof ptypes)[number]
type RouteBodyType = (typeof btypes)[number]
type RouteResultType = (typeof rtypes)[number]
type RouteResultInfo = RouteResultJson[] | 'String' | 'Buffer'
type Selects = string[] | number[] | readonly number[] | readonly string[]
type RouteSecure = { name: string; timesafe: string | false; query: boolean }

interface RouteInfo {
  $route: true
  route: string
  method: RouteMethod
  name: string
  routesecure: RouteSecure | false
  cdnconfig: RouteCdnConfig
  queries: RouteQueryInfo[]
  params: RouteParamInfo[]
  bodies: RouteBodyInfo[]
  files: RouteFileInfo[]
  results: RouteResultInfo
}

interface RouteCdnConfig {
  cdn: boolean
  perma: boolean
  secure: boolean
}

interface RouteQueryInfo {
  $query: true
  name: string
  type: QueryType
  optional: boolean
  selects: Selects | null
}

interface RouteParamInfo {
  $param: true
  index?: number
  name: string
  type: ParamType
  selects: Selects | null
  optional: boolean
}

interface RouteBodyInfo {
  $body: true
  name: string
  type: RouteBodyType
  optional: boolean
  selects: Selects | null
  object: RouteBodyInfo[]
}

interface RouteFileInfo {
  $file: true
  name: string
  type: FileType
  optional: boolean
  selects: null
  validators: RouteFileInfoValidators
}

interface RouteFileInfoValidators {
  maxsize: number
  limit: number
  mimetypes: null | string[]
}

interface RouteResultJson {
  $result: true
  name: string
  type: RouteResultType
  optional: boolean
  selects: Selects | null
  object: RouteResultJson[]
}
`
