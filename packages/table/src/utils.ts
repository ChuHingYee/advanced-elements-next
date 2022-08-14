import type { FormatMaps, SoruceData } from './defaults'
export function formatData(source: any, maps: FormatMaps) {
  const result: SoruceData = {
    data: [],
    total: 0,
  }
  Object.keys(maps).forEach((key) => {
    if (maps[key] === 'data') {
      result.data = source[key]
    } else if (maps[key]) {
      result[maps[key]] = source[key] || 0
    }
  })
  return result
}
