const generateId = require('./generate-id')

const getId = (id, shouldGenerateId) => {
	if (id) return id
	if (shouldGenerateId) return generateId()
	return null
}

const parseAttrs = attrs => {
	for (const k in attrs) {
		const attr = attrs[k]
		const floatAttr = parseFloat(attr)
		if (floatAttr.toString() === attr) {
			attrs[k] = floatAttr
		} else if (attr === 'true') {
			attrs[k] = true
		} else if (attr === 'false') {
			attrs[k] = false
		}
	}

	return attrs
}

const draftJsonTransform = (node, shouldGenerateId) => {
	if (!node) return

	for (const prop in node) {
		if (typeof node[prop] === 'object') {
			draftJsonTransform(node[prop], shouldGenerateId)
		}
	}

	for (const prop in node) {
		if (
			node[prop] &&
			typeof node[prop] === 'object' &&
			node[prop].type &&
			node[prop].type === 'element'
		) {
			const o = node[prop]
			if (!o.attributes) {
				o.attributes = {}
			}

			if (!o.elements) {
				o.elements = []
			}

			const id = getId(o.attributes.id, shouldGenerateId)
			delete o.attributes.id

			node[prop] = {
				id: id,
				type: o.name,
				content: parseAttrs(o.attributes),
				children: o.elements
			}
		}
	}
}

module.exports = draftJsonTransform
