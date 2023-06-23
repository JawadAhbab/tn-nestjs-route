import { BadRequestException } from '@nestjs/common'
import { AnyObject, ObjectOf } from 'tn-typescript'
import { RouteFileInfoValidators } from '../../RouteField/RouteFile'
import { RouteInfo } from '../../RouteInfo'
type Files = ObjectOf<Express.Multer.File[]>
const fileerr = (name: string) => new BadRequestException(`Invalid file: ${name}`)
const validate = (file: Express.Multer.File, validators: RouteFileInfoValidators) => {
  const { maxsize, mimetypes } = validators
  if (file.size > maxsize) return false
  if (!mimetypes) return true
  return mimetypes.includes(file.mimetype)
}

export const routeFieldsFiles = (fields: AnyObject, files: Files, route: RouteInfo) => {
  route.files.forEach(({ name, optional, type, validators }) => {
    const multers = files[name]
    if (!optional && !multers) throw fileerr(name)
    if (!multers) return

    if (type === 'file') {
      if (multers.length > 1) throw fileerr(name)
      const file = multers[0]
      if (!validate(file, validators)) throw fileerr(name)
      return (fields[name] = file)
    }

    if (multers.length > validators.limit) throw fileerr(name)
    if (!multers.map(f => validate(f, validators)).every(i => i)) throw fileerr(name)
    fields[name] = multers
  })
}
