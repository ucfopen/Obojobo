const xmlEncode = require('./xml-encode')

const processAttrs = (content, blockedAttributes) => {
	let attrs = ''
	for (const attr in content) {
		if (
			content[attr] === null ||
			typeof content[attr] === 'object' ||
			blockedAttributes.includes(attr)
		) {
			continue
		}

		attrs += ` ${attr}="${xmlEncode(content[attr])}"`
	}

	return attrs
}

module.exports = processAttrs
