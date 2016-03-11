TextMethods = require 'OboDraft/text/textmethods'
POS = require 'OboDraft/text/textpositionmethods'
Chunk = require 'OboDraft/models/chunk'

Break = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) -> {}

	render: ->
		React.createElement 'div', null,
			React.createElement 'hr'


module.exports = Break