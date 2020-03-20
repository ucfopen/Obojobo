const parseTg = el => {
	const tg = []

	for (const element of el.elements) {
		tg.push(parseT(element))
	}

	return tg
}

const parseT = el => {
	const t = {
		text: {
			value: '',
			styleList: []
		},
		data: el.attributes || null
	}

	for (const value of el.value) {
		parseText(value, t.text)
	}

	return t
}

const parseText = (node, textItem) => {
	if (node.type === 'text') {
		textItem.value += node.text
		return
	}

	let type = node.name
	let data = {}

	switch (node.name) {
		case 'latex':
			type = '_latex'
			if (node.attributes && node.attributes.alt) {
				data = { alt: node.attributes.alt }
			}
			break

		case 'a':
			data = {
				href: node.attributes.href
			}
			break

		case 'sup':
			data = 1
			break

		case 'sub':
			type = 'sup'
			data = -1
			break

		case 'code':
			type = 'monospace'
			break

		// Preserve any abnormal attribution
		default:
			if (node.attributes) {
				data = node.attributes
			}
			break
	}

	const styleRange = {
		type: type,
		data: data,
		start: textItem.value.length,
		end: 0
	}

	textItem.styleList.push(styleRange)

	for (const value of node.value) {
		parseText(value, textItem)
	}

	styleRange.end = textItem.value.length
}

module.exports = parseTg
