import { isArray } from 'tn-validate'
const filetypes = ['file', 'file[]'] as const
type FileType = (typeof filetypes)[number]
type FileSizeUnit = 'G' | 'M' | 'K' | ''
type FileSize = `${number}${FileSizeUnit}`
export interface RouteFileInfo {
  $file: true
  name: string
  type: FileType
  optional: boolean
  validators: RouteFileInfoValidators
}
export interface RouteFileInfoValidators {
  maxsize: number
  limit: number
  mimetypes: null | string[]
}
interface Options {
  optional?: boolean
  maxsize?: FileSize | number
  limit?: number
  mimetype?: null | string | string[]
}

export const RouteFile = (opts?: Options) => {
  return (target: any, name: string) => {
    const optional = opts?.optional || false
    const typename = Reflect.getMetadata('design:type', target, name).name
    const type: FileType = typename === 'Array' ? 'file[]' : 'file'
    const limit = type === 'file' ? 1 : opts?.limit || 20

    const msstr = opts?.maxsize?.toString() || '50M'
    const mscount = parseFloat(msstr)
    const maxsize = msstr.endsWith('G')
      ? mscount * 1_000_000_000
      : msstr.endsWith('M')
      ? mscount * 1_000_000
      : msstr.endsWith('K')
      ? mscount * 1_000
      : mscount

    const mimetype = opts?.mimetype || null
    const mimetypes = !mimetype ? null : isArray(mimetype) ? mimetype : [mimetype]

    const validators: RouteFileInfoValidators = { maxsize, limit, mimetypes }
    const getter = (): RouteFileInfo => ({ $file: true, name, type, optional, validators })
    Object.defineProperty(target, name, { get: getter })
  }
}
