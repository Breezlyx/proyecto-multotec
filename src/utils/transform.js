// Small helpers to convert object keys between snake_case and camelCase
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export function camelToSnake(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val)
}

export function keysToCamel(o) {
  if (Array.isArray(o)) return o.map(keysToCamel)
  if (!isObject(o)) return o
  const n = {}
  Object.keys(o).forEach((k) => {
    const nk = snakeToCamel(k)
    n[nk] = keysToCamel(o[k])
  })
  return n
}

export function keysToSnake(o) {
  if (Array.isArray(o)) return o.map(keysToSnake)
  if (!isObject(o)) return o
  const n = {}
  Object.keys(o).forEach((k) => {
    const nk = camelToSnake(k)
    n[nk] = keysToSnake(o[k])
  })
  return n
}

export default {
  keysToCamel,
  keysToSnake
}
