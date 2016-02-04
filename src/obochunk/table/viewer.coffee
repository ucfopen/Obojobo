#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!


React = require 'react'

Text = require '../../components/text'
TextGroup = require '../../text/textgroup'
TextMethods = require '../../text/textmethods'


Table = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			content = descriptor.content

			textGroup: TextGroup.fromDescriptor content.textGroup, parseInt(content.rows, 10) * parseInt(content.cols, 10)
			position: content.position
			rows: content.rows
			cols: content.cols

		saveSelection:    TextMethods.saveSelection
		restoreSelection: TextMethods.restoreSelection
		styleSelection:   TextMethods.styleSelection
		unstyleSelection: TextMethods.unstyleSelection

	render: ->
		chunk = @props.chunk
		data = chunk.componentContent
		numCols = data.cols

		React.createElement 'div', null, [
			React.createElement 'table', { className:'main', style: { width: '100%', tableLayout: 'fixed' } },
				React.createElement 'tbody', null,
					[0...data.rows].map (rowNum) ->
						React.createElement 'tr', null,
							data.textGroup.items.slice(rowNum * numCols, (rowNum + 1) * numCols).map (textGroupItem, index) ->
								React.createElement 'td', { style: { border: '1px solid gray' } },
									Text.createElement textGroupItem.text, chunk, rowNum * numCols + index
		]




module.exports = Table