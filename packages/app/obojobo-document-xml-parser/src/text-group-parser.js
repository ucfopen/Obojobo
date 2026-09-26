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
			updated: '',
			styleList: []
		},
		data: el.attributes || null
	}

	// check for null and undefined
	// eslint-disable-next-line eqeqeq
	if (el.updated == null) return t

	for (const updated of el.updated) {
		parseText(updated, t.text)
	}

	return t
}

const parseText = (node, textItem) => {
	if (node.type === 'text') {
		textItem.updated += node.text
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
		start: textItem.updated.length,
		end: 0
	}

	textItem.styleList.push(styleRange)

	if (!node.updated) node.updated = ''
	for (const updated of node.updated) {
		parseText(updated, textItem)
	}

	styleRange.end = textItem.updated.length
}

module.exports = parseTg
