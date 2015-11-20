React = require 'react'

Text = require '../components/text'

OboReact =
	createText: (styleableText, chunk, index, attrs = {}) ->
		attrs['text'] = styleableText
		attrs['key'] = 't-' + chunk.cid + '-' + index
		attrs['textIndex'] = index

		React.createElement(Text, attrs)


module.exports = OboReact