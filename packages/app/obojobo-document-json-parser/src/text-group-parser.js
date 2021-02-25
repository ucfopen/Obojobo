const StyleableText = require('obojobo-document-engine/src/scripts/common/text/styleable-text')
const styleableTextRenderer = require('obojobo-document-engine/src/scripts/common/text/styleable-text-renderer')
const xmlEncode = require('./xml-encode')

const textGroupParser = textGroup => {
	if (!textGroup) {
		return ''
	}

	return `<textGroup>${textGroup
		.map(t => `<t${getAttrsString(t.data)}>${textParser(t.text)}</t>`)
		.join('')}</textGroup>`
}

const getAttrsString = attrs => {
	if (!attrs) return ''

	return (
		' ' +
		Object.keys(attrs)
			.map(attrName => `${attrName}="${xmlEncode(attrs[attrName])}"`)
			.join(' ')
	)
}

const createChild = el => {
	if (el.nodeType === 'text') {
		return xmlEncode(el.text)
	}

	if (el.type === 'span') {
		const innerXML = el.children.map(createChild).join('')

		if (el.attrs && el.attrs.class && el.attrs.class === 'latex') {
			return `<latex>${innerXML}</latex>`
		} else {
			return innerXML
		}
	}

	return `<${el.type}${getAttrsString(el.attrs)}>${el.children.map(createChild).join('')}</${
		el.type
	}>`
}

const textParser = text => {
	const s = StyleableText.createFromObject(text)
	s.normalizeStyles()

	return createChild(styleableTextRenderer(s))
}

module.exports = textGroupParser
