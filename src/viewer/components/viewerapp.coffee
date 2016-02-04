React = require 'react'

ComponentClassMap = require '../../util/componentclassmap'

Selection = require '../../editor/components/editor/selection'
TextMenu = require './viewer/textmenu'

ComponentClassMap.register 'OboChunk.Heading',    require '../../obochunk/heading/viewer'
ComponentClassMap.register 'OboChunk.SingleText', require '../../obochunk/singletext/viewer'
ComponentClassMap.register 'OboChunk.Break',      require '../../obochunk/break/viewer'
ComponentClassMap.register 'OboChunk.YouTube',    require '../../obochunk/youtube/viewer'
ComponentClassMap.register 'OboChunk.IFrame',     require '../../obochunk/iframe/viewer'
ComponentClassMap.register 'OboChunk.List',       require '../../obochunk/list/viewer'
ComponentClassMap.register 'OboChunk.Figure',     require '../../obochunk/figure/viewer'
ComponentClassMap.register 'OboChunk.Question',   require '../../obochunk/question/viewer'
ComponentClassMap.register 'OboChunk.Table',      require '../../obochunk/table/viewer'

ComponentClassMap.setDefaultComponentClass require '../../obochunk/singletext/viewer'


ViewerApp = React.createClass
	getInitialState: ->
		{
			module: @props.module
			selection: new Selection()
		}

	onMouseUp: ->
		@state.selection.update(@state.module)

		@setState {
			selection: @state.selection
		}

	onTextMenuCommand: (command) ->
		console.log 'otmc', command

		switch command
			when 'Ask a question'
				question = prompt 'Question?'

				for chunk in @state.selection.sel.all
					chunk.callComponentFn 'styleSelection', @state.selection, ['_comment', {'data-comment-text':question}]

				@state.selection.clear()

				@setState {
					module: @state.module
					selection: @state.selection
				}


	render: ->
		React.createElement 'div', null,
			React.createElement(TextMenu, { selection:@state.selection, commands:['Ask a question', 'Save snippet'], commandHandler:@onTextMenuCommand }),
			React.createElement('div', { id:'viewer', className:'content', onMouseUp:@onMouseUp },
				@state.module.chunks.models.map (chunk, index) ->
					component = chunk.getComponent()

					React.createElement 'div', {
						className: 'component'
						'data-component-type': chunk.get 'type'
						'data-component-index': index
						'data-oboid': chunk.cid
						'data-server-index': chunk.get 'index'
						'data-server-id': chunk.get 'id'
						'data-server-derived-from': chunk.get 'derivedFrom'
						'data-changed': chunk.dirty
						key: index
						# style: {
							# opacity: if not activeChunk? or chunk is activeChunk then '1' else '0.2'
						# }
					},
						React.createElement component, {
							chunk: chunk
							# showModalFn: showModalFn
							# isActive: activeChunk is chunk
						}
			)



module.exports = ViewerApp