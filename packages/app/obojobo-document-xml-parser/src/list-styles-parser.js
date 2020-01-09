const parseListStyles = el => {
	const listStyles = {}

	el.elements.forEach(child => {
		switch (child.name) {
			case 'type':
				listStyles.type = child.value[0].text
				break

			case 'indents':
				listStyles.indents = parseIndents(child.value)
				break
		}
	})

	return listStyles
}

const parseIndents = indentsArr => {
	const indents = {}
	for (const i in indentsArr) {
		const indentEl = indentsArr[i]
		const level = indentEl.attributes.level

		delete indentEl.attributes.level
		indents[level] = indentEl.attributes
	}

	return indents
}

module.exports = parseListStyles
