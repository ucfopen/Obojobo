import ListStyles from './list-styles'

const regexes = {
	bulletListItem: /^[ \t]*(\*)[ \t]+([\s\S]*)/, // Interpert text such as ' * list item' as a bullet in a list
	numericListItem: /^[ \t]*([0-9]+|[A-Za-z]|VIII|VII|VI|IV|IX|III|II|viii|vii|vi|iv|ix|iii|ii)\.[ \t]+$/, // Interpret text such as ' 1. list item' as a bullet in a list

	symbolUpperRoman: /VIII|VII|VI|IV|IX|V|III|II|I/,
	symbolLowerRoman: /viii|vii|vi|iv|ix|v|iii|ii|i/,
	symbolUpperLetter: /[A-Z]+/,
	symbolLowerLetter: /[a-z]+/,
	symbolLeadingZeroNumber: /0+[0-9]+/,
	symbolNumber: /[0-9]+/
}

const looksLikeListItem = function(s) {
	let result = false

	if (s.length === 2) {
		if (replace(s, 'bulletListItem')) {
			result = {
				type: ListStyles.TYPE_UNORDERED,
				symbol: '*',
				symbolIndex: 1,
				defaultSymbol: true,
				symbolStyle: ''
			}
		}
	} else if (s.length >= 3) {
		const numericList = replace(s, 'numericListItem')
		if (numericList) {
			const symbolStyle = getSymbolStyle(numericList.symbol)
			const symbolIndex = getSymbolIndex(numericList.symbol, symbolStyle)

			result = {
				type: ListStyles.TYPE_ORDERED,
				symbol: numericList.symbol,
				symbolIndex,
				defaultSymbol: numericList.symbol === '1',
				symbolStyle
			}
		}
	}

	return result
}

const replace = function(s, regexName) {
	const matches = regexes[regexName].exec(s)
	if (!matches || matches.length <= 1) {
		return null
	}

	return {
		symbol: matches[1],
		text: matches[2]
	}
}

const getSymbolStyle = function(symbol) {
	if (regexes.symbolLeadingZeroNumber.exec(symbol)) {
		return ListStyles.STYLE_LEAD_ZERO_NUMERIC
	}

	if (regexes.symbolNumber.exec(symbol)) {
		return ListStyles.STYLE_NUMERIC
	}

	if (regexes.symbolUpperRoman.exec(symbol)) {
		return ListStyles.STYLE_UPPERCASE_ROMAN
	}

	if (regexes.symbolLowerRoman.exec(symbol)) {
		return ListStyles.STYLE_LOWERCASE_ROMAN
	}

	if (regexes.symbolUpperLetter.exec(symbol)) {
		return ListStyles.STYLE_UPPERCASE_LETTER
	}

	// Because of the numericListItem regex, symbol is guaranteed to be one of the styles
	// If we get here, it has to be lowercase by process of elimination
	return ListStyles.STYLE_LOWERCASE_LETTER
}

const getSymbolIndex = function(symbol, symbolStyle) {
	switch (symbolStyle) {
		case ListStyles.STYLE_NUMERIC:
		case ListStyles.STYLE_LEAD_ZERO_NUMERIC:
			return parseInt(symbol, 10)
		case ListStyles.STYLE_LOWERCASE_LETTER:
			return symbol.charCodeAt(0) - 96
		case ListStyles.STYLE_UPPERCASE_LETTER:
			return symbol.charCodeAt(0) - 64
		// Because of the getSymbolStyle, symbol is garunteed to be one of the styles
		// If we get here, it has to be roman numerals by process of elimination
		default:
			switch (symbol.toLowerCase()) {
				case 'i':
					return 1
				case 'ii':
					return 2
				case 'iii':
					return 3
				case 'iv':
					return 4
				case 'v':
					return 5
				case 'vi':
					return 6
				case 'vii':
					return 7
				case 'viii':
					return 8
				// Because of the regex, symbol has to be i - ix
				// If we get here, it has to be 9 by process of elimination
				default:
					return 9
			}
	}
}

export default looksLikeListItem
