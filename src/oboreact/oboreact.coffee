React = require 'react'

Text = require '../components/text'

OboReact =
	createElement: (tagName, oboNode, index, attrs = {}, children = null) ->
		attrs['data-oboid'] = oboNode.id
		attrs['data-obo-type'] = oboNode.type
		attrs['data-obo-index'] = index
		attrs['key'] = oboNode.id

		React.createElement(tagName, attrs, children)

	createChildren: (oboNode, parentIndex) ->
		oboNode.children.map (childNode, index) ->
			newIndex = parentIndex + '.' + index

			if childNode.componentClass?
				OboReact.createElement childNode.componentClass, childNode, newIndex, { oboNode:childNode, index:newIndex, parentIndex:parentIndex }

	createText: (styleableText, oboNode, index, attrs = {}, parentIndex) ->
		# console.log 'createText', styleableText
		attrs['styleableText'] = styleableText
		attrs['id'] = 't-' + oboNode.id + '-' + index
		attrs['key'] = 't-' + oboNode.id + '-' + index
		attrs['index'] = parentIndex + '.t' + index
		attrs['ownerId'] = oboNode.id
		attrs['textIndex'] = index

		React.createElement(Text, attrs)


module.exports = OboReact