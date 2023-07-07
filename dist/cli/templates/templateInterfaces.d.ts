export declare const templateInterfaces = "\nconst qtypes = ['string', 'number', 'boolean'] as const\nconst ptypes = ['string', 'number', 'boolean'] as const\nconst btypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore\nconst rtypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore\nconst filetypes = ['file', 'file[]'] as const\ntype RouteMethod = 'GET' | 'POST'\ntype FileType = (typeof filetypes)[number]\ntype QueryType = (typeof qtypes)[number]\ntype ParamType = (typeof ptypes)[number]\ntype RouteBodyType = (typeof btypes)[number]\ntype RouteResultType = (typeof rtypes)[number]\ntype RouteResultInfo = RouteResultJson[] | 'String' | 'Buffer'\ntype Selects = string[] | number[] | readonly number[] | readonly string[]\n\ninterface RouteInfo {\n  $route: true\n  route: string\n  method: RouteMethod\n  name: string\n  secure: boolean\n  queries: RouteQueryInfo[]\n  params: RouteParamInfo[]\n  bodies: RouteBodyInfo[]\n  files: RouteFileInfo[]\n  results: RouteResultInfo\n}\n\ninterface RouteQueryInfo {\n  $query: true\n  name: string\n  type: QueryType\n  optional: boolean\n  selects: Selects | null\n}\n\ninterface RouteParamInfo {\n  $param: true\n  index?: number\n  name: string\n  type: ParamType\n  selects: Selects | null\n  optional: boolean\n}\n\ninterface RouteBodyInfo {\n  $body: true\n  name: string\n  type: RouteBodyType\n  optional: boolean\n  selects: Selects | null\n  object: RouteBodyInfo[]\n}\n\ninterface RouteFileInfo {\n  $file: true\n  name: string\n  type: FileType\n  optional: boolean\n  selects: null\n  validators: RouteFileInfoValidators\n}\n\ninterface RouteFileInfoValidators {\n  maxsize: number\n  limit: number\n  mimetypes: null | string[]\n}\n\ninterface RouteResultJson {\n  $result: true\n  name: string\n  type: RouteResultType\n  optional: boolean\n  selects: Selects | null\n  object: RouteResultJson[]\n}\n";
