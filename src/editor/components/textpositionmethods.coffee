Text = require '../../components/text'

TextPositionMethods =
	getCaretInfo: (cursor, oboNode) ->
		info = Text.getOboTextInfo cursor.node, cursor.offset
		info.text = TextPositionMethods.getText oboNode, info.textIndex

		info

	getText: (oboNode, index) ->
		oboNode.data.textGroup.get(index).text

	getStartInfo: (oboNode) ->
		textIndex: 0
		offset:    0
		text:      oboNode.data.textGroup.first.text

	getEndInfo: (oboNode) ->
		textIndex: oboNode.data.textGroup.length - 1
		offset:    oboNode.data.textGroup.last.text.length
		text:      oboNode.data.textGroup.last.text

	getSelSpanInfo: (sel, oboNode) ->
		textGroup = oboNode.data.textGroup

		switch sel.getRange(oboNode.domEl)
			when 'start'
				start: TextPositionMethods.getCaretInfo sel.start, oboNode
				end:   TextPositionMethods.getEndInfo oboNode

			when 'end'
				start: TextPositionMethods.getStartInfo oboNode
				end:   TextPositionMethods.getCaretInfo sel.end, oboNode

			when 'both'
				start: TextPositionMethods.getCaretInfo sel.start, oboNode
				end:   TextPositionMethods.getCaretInfo sel.end, oboNode

			when 'insideOrOutside'
				start: TextPositionMethods.getStartInfo oboNode
				end:   TextPositionMethods.getEndInfo oboNode

	getTextNode: (oboNode, childIndex) ->
		oboNode.domEl.querySelector "*[data-text-index='#{childIndex}']"

	reselectSpan: (sel, oboNode, span = null) ->
		span ?=  TextPositionMethods.getSelSpanInfo sel, oboNode
		range = sel.getRange(oboNode.domEl)
		if range is 'start' or range is 'both'
			sel.setFutureStart oboNode, { offset: span.start.offset, childIndex: span.start.textIndex }
		if range is 'end' or range is 'both'
			sel.setFutureEnd oboNode, { offset: span.end.offset, childIndex: span.end.textIndex }


module.exports = TextPositionMethods