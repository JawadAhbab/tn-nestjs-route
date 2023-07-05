export const getAllProperties = (cls: Function) => {
  const properties: string[] = []
  if (cls.prototype) properties.push(...Object.getOwnPropertyNames(cls.prototype))
  const extend = Object.getPrototypeOf(cls)
  if (extend) properties.push(...getAllProperties(extend))
  return properties
}
