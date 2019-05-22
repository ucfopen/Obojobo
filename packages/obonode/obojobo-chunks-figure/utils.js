export const debounce = function(ms, cb) {
	clearTimeout(debounce.id)
	return (debounce.id = setTimeout(cb, ms))
}
debounce.id = null

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const isUrlUUID = val => uuidRegex.test(val)
