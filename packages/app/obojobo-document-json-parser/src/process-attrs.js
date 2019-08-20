const xmlEncode = require('./xml-encode')

const processAttrs = (content, blackListedAttributes) => {
	let attrs = ''
	for (const attr in content) {
		if (content[attr] === null || blackListedAttributes.includes(attr)) continue
		attrs += ` ${attr}="${xmlEncode(content[attr])}"`
	}

	return attrs
}

module.exports = processAttrs
