const parseTg = el => {
	const tg = []

	for (const i in el.elements) {
		tg.push(parseT(el.elements[i]))
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

	for (const i in el.value) {
		parseText(el.value[i], t.text)
	}

	return t
}

const parseText = (node, textItem, foundText) => {
	if (node.type === 'text') {
		if (!foundText && typeof node.text === 'string') {
			foundText = true
		}

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
	}

	const styleRange = {
		type: type,
		data: data,
		start: textItem.value.length,
		end: 0
	}

	textItem.styleList.push(styleRange)

	for (const i in node.value) {
		parseText(node.value[i], textItem)
	}

	styleRange.end = textItem.value.length
}

module.exports = parseTg
