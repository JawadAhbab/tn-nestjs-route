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

interface RouteInfo {
  $route: true
  route: string
  method: RouteMethod
  name: string
  queries: RouteQueryInfo[]
  params: RouteParamInfo[]
  bodies: RouteBodyInfo[]
  files: RouteFileInfo[]
  results: RouteResultInfo
}

interface RouteQueryInfo {
  $query: true
  name: string
  type: QueryType
  optional: boolean
}

interface RouteParamInfo {
  $param: true
  name: string
  type: ParamType
  optional: boolean
}

interface RouteBodyInfo {
  $body: true
  name: string
  type: RouteBodyType
  optional: boolean
  object: RouteBodyInfo[]
}

interface RouteFileInfo {
  $file: true
  name: string
  type: FileType
  optional: boolean
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
  object: RouteResultJson[]
}
`
