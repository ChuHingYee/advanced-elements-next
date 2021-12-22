import type { SoruceData, FormatMaps } from './defaults'
export function formatData(source: any, maps: FormatMaps) {
  const result: SoruceData = {
    data: [],
    size: 0,
    total: 0,
    totalPage: 0,
  }
  Object.keys(maps).forEach((key) => {
    if (maps[key] === 'data') {
      result.data = source[key]
    } else if (maps[key]) {
      result[key] = source[key] || 0
    }
  })
  return result
}
