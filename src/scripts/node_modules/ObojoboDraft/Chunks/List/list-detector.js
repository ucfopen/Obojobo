import ListStyles from './liststyles';

let regexes = {
	bulletListItem: /^[ \t]*(\*)[ \t]+([\s\S]*)/, // Interpert text such as ' * list item' as a bullet in a list
	numericListItem: /^[ \t]*([0-9]+|[A-Za-z]|VIII|VII|VI|IV|IX|III|II|viii|vii|vi|iv|ix|iii|ii)\.[ \t]+([\s\S]*)/, // Interpert text such as ' 1. list item' as a bullet in a list

	symbolUpperRoman: /VIII|VII|VI|IV|IX|V|III|II|I/,
	symbolLowerRoman: /viii|vii|vi|iv|ix|v|iii|ii|i/,
	symbolUpperLetter: /[A-Z]+/,
	symbolLowerLetter: /[a-z]+/,
	symbolLeadingZeroNumber: /0+[0-9]+/,
	symbolNumber: /[0-9]+/
};

let looksLikeListItem = function(s) {
	let result = false;

	if (s.length === 2) {
		let bullet = replace(s, 'bulletListItem');
		if (bullet != null) {
			result = {
				type:  ListStyles.TYPE_UNORDERED,
				text:  bullet.text,
				index: bullet.text.length,
				symbol: '*',
				symbolIndex: 1,
				defaultSymbol: true,
				symbolStyle: ''
			};
		}
	} else if ((s.length === 3) || (s.length === 4)) {
		let numericList = replace(s, 'numericListItem');
		if (numericList != null) {
			let symbolStyle = getSymbolStyle(numericList.symbol);
			let symbolIndex = getSymbolIndex(numericList.symbol, symbolStyle);

			result = {
				type:  ListStyles.TYPE_ORDERED,
				text:  numericList.text,
				index: numericList.text.length,
				symbol: numericList.symbol,
				symbolIndex,
				defaultSymbol: numericList.symbol === "1",
				symbolStyle
			};
		}
	}

	return result;
};

var replace = function(s, regexName) {
	let matches = regexes[regexName].exec(s);
	if ((matches == null) || (matches.length <= 1)) { return null; }

	return {
		symbol: matches[1],
		text: matches[2]
	};
};

var getSymbolStyle = function(symbol) {
	let matches = regexes.symbolLeadingZeroNumber.exec(symbol);
	if (matches) { return ListStyles.STYLE_LEAD_ZERO_NUMERIC; }

	matches = regexes.symbolNumber.exec(symbol);
	if (matches) { return ListStyles.STYLE_NUMERIC; }

	matches = regexes.symbolUpperRoman.exec(symbol);
	if (matches) { return ListStyles.STYLE_UPPERCASE_ROMAN; }

	matches = regexes.symbolLowerRoman.exec(symbol);
	if (matches) { return ListStyles.STYLE_LOWERCASE_ROMAN; }

	matches = regexes.symbolUpperLetter.exec(symbol);
	if (matches) { return ListStyles.STYLE_UPPERCASE_LETTER; }

	matches = regexes.symbolLowerLetter.exec(symbol);
	if (matches) { return ListStyles.STYLE_LOWERCASE_LETTER; }

	return null;
};

var getSymbolIndex = function(symbol, symbolStyle) {
	switch (symbolStyle) {
		case ListStyles.STYLE_NUMERIC: case ListStyles.STYLE_LEAD_ZERO_NUMERIC:
			return parseInt(symbol, 10);
		case ListStyles.STYLE_LOWERCASE_LETTER:
			return symbol.charCodeAt(0) - 96;
		case ListStyles.STYLE_UPPERCASE_LETTER:
			return symbol.charCodeAt(0) - 64;
		case ListStyles.STYLE_LOWERCASE_ROMAN: case ListStyles.STYLE_UPPERCASE_ROMAN:
			switch (symbol.toLowerCase()) {
				case 'i':    return 1;
				case 'ii':   return 2;
				case 'iii':  return 3;
				case 'iv':   return 4;
				case 'v':    return 5;
				case 'vi':   return 6;
				case 'vii':  return 7;
				case 'viii': return 8;
				case 'xi':   return 9;
				default:             return 1;
			}
		default:
			return 1;
	}
};


export default looksLikeListItem;