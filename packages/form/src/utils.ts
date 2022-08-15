export const getValue = (origin: Record<string, any>, prop: string) => {
  return prop.split('/').reduce((source, key) => {
    return source ? source[key] : null
  }, origin)
}

export function pushData2Arr<T>(target: T[], source: T, key: string) {
  const existIndex = target.findIndex((item) => {
    return item[key] === source[key]
  })
  if (existIndex !== -1) {
    target[existIndex] = source
  } else {
    target.push(source)
  }
}

export function getParentProp(prop: string) {
  const lastIndex = prop.lastIndexOf('/')
  if (lastIndex !== -1) {
    return {
      parent: prop.slice(0, Math.max(0, lastIndex)),
      current: prop.slice(lastIndex + 1, prop.length),
    }
  } else {
    return false
  }
}
