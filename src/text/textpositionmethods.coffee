Text = require '../components/text'

TextPositionMethods =
	getCaretInfo: (cursor, chunk) ->
		info = Text.getOboTextInfo cursor.node, cursor.offset
		info.text = TextPositionMethods.getText chunk, info.textIndex

		info

	getText: (chunk, index) ->
		data = chunk.componentContent

		data.textGroup.get(index).text

	getStartInfo: (chunk) ->
		data = chunk.componentContent

		textIndex: 0
		offset:    0
		text:      data.textGroup.first.text

	getEndInfo: (chunk) ->
		data = chunk.componentContent

		textIndex: data.textGroup.length - 1
		offset:    data.textGroup.last.text.length
		text:      data.textGroup.last.text

	getSelSpanInfo: (sel, chunk) ->
		data = chunk.componentContent

		textGroup = data.textGroup

		switch sel.getRange(chunk.getDomEl())
			when 'start'
				start: TextPositionMethods.getCaretInfo sel.start, chunk
				end:   TextPositionMethods.getEndInfo chunk

			when 'end'
				start: TextPositionMethods.getStartInfo chunk
				end:   TextPositionMethods.getCaretInfo sel.end, chunk

			when 'both'
				start: TextPositionMethods.getCaretInfo sel.start, chunk
				end:   TextPositionMethods.getCaretInfo sel.end, chunk

			when 'insideOrOutside'
				start: TextPositionMethods.getStartInfo chunk
				end:   TextPositionMethods.getEndInfo chunk

	getTextNode: (chunk, childIndex) ->
		chunk.getDomEl().querySelector "*[data-text-index='#{childIndex}']"

	reselectSpan: (sel, chunk, span = null) ->
		span ?=  TextPositionMethods.getSelSpanInfo sel, chunk
		range = sel.getRange(chunk.getDomEl())
		if range is 'start' or range is 'both'
			sel.setFutureStart chunk, { offset: span.start.offset, childIndex: span.start.textIndex }
		if range is 'end' or range is 'both'
			sel.setFutureEnd chunk, { offset: span.end.offset, childIndex: span.end.textIndex }


module.exports = TextPositionMethods