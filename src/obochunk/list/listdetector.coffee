ListStyles = require './liststyles'

regexes =
	bulletListItem: /^[ \t]*(\*)[ \t]+([\s\S]*)/ # Interpert text such as ' * list item' as a bullet in a list
	numericListItem: /^[ \t]*([0-9]+|[A-Za-z]|VIII|VII|VI|IV|IX|III|II|viii|vii|vi|iv|ix|iii|ii)\.[ \t]+([\s\S]*)/ # Interpert text such as ' 1. list item' as a bullet in a list
	break: /^\-\-\-\-*$/

	symbolUpperRoman: /VIII|VII|VI|IV|IX|V|III|II|I/
	symbolLowerRoman: /viii|vii|vi|iv|ix|v|iii|ii|i/
	symbolUpperLetter: /[A-Z]+/
	symbolLowerLetter: /[a-z]+/
	symbolLeadingZeroNumber: /0+[0-9]+/
	symbolNumber: /[0-9]+/

looksLikeListItem = (s) ->
	result = false

	bullet = replace s, 'bulletListItem'
	if bullet?
		result =
			type:  ListStyles.TYPE_UNORDERED
			text:  bullet.text
			index: bullet.text.length
			symbol: '*'
			symbolIndex: 1
			defaultSymbol: true
			symbolStyle: ''
	else
		numericList = replace s, 'numericListItem'
		if numericList?
			symbolStyle = getSymbolStyle numericList.symbol
			symbolIndex = getSymbolIndex numericList.symbol, symbolStyle

			result =
				type:  ListStyles.TYPE_ORDERED
				text:  numericList.text
				index: numericList.text.length
				symbol: numericList.symbol
				symbolIndex: symbolIndex
				defaultSymbol: numericList.symbol is "1"
				symbolStyle: symbolStyle

	result

looksLikeBreak = (s) ->
	regexes['break'].exec(s) isnt null

replace = (s, regexName) ->
	matches = regexes[regexName].exec s
	return null if not matches? or matches.length <= 1

	symbol: matches[1]
	text: matches[2]

getSymbolStyle = (symbol) ->
	console.log 'GSS', symbol

	matches = regexes.symbolLeadingZeroNumber.exec symbol
	return ListStyles.STYLE_LEAD_ZERO_NUMERIC if matches

	matches = regexes.symbolNumber.exec symbol
	return ListStyles.STYLE_NUMERIC if matches

	matches = regexes.symbolUpperRoman.exec symbol
	return ListStyles.STYLE_UPPERCASE_ROMAN if matches

	matches = regexes.symbolLowerRoman.exec symbol
	return ListStyles.STYLE_LOWERCASE_ROMAN if matches

	matches = regexes.symbolUpperLetter.exec symbol
	return ListStyles.STYLE_UPPERCASE_LETTER if matches

	matches = regexes.symbolLowerLetter.exec symbol
	return ListStyles.STYLE_LOWERCASE_LETTER if matches

	return null

getSymbolIndex = (symbol, symbolStyle) ->
	switch symbolStyle
		when ListStyles.STYLE_NUMERIC, ListStyles.STYLE_LEAD_ZERO_NUMERIC
			parseInt symbol, 10
		when ListStyles.STYLE_LOWERCASE_LETTER
			symbol.charCodeAt(0) - 96
		when ListStyles.STYLE_UPPERCASE_LETTER
			symbol.charCodeAt(0) - 64
		when ListStyles.STYLE_LOWERCASE_ROMAN, ListStyles.STYLE_UPPERCASE_ROMAN
			switch symbol.toLowerCase()
				when 'i'    then 1
				when 'ii'   then 2
				when 'iii'  then 3
				when 'iv'   then 4
				when 'v'    then 5
				when 'vi'   then 6
				when 'vii'  then 7
				when 'viii' then 8
				when 'xi'   then 9
				else             1
		else
			1


module.exports = looksLikeListItem