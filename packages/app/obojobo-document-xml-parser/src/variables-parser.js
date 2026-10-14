const parseVars = el => {
	const vars = el.elements.map(child => parseVariable(child))
	return vars
}

const parseVariable = el => {
	switch (el.name) {
		case 'var':
			return parseV(el)
	}
}

const parseV = el => {
	return { ...el.attributes }
}

module.exports = parseVars
