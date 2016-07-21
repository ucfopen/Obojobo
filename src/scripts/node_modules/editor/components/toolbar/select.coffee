Select = React.createClass
	getInitialState: ->
		selectedOption: 0

	componentWillReceiveProps: (nextProps) ->
		@setState { selectedOption:nextProps.command.selectedOption }

	onChange: (event) ->
		@setState { selectedOption:event.target.value }
		@props.command.selectedOption = event.target.value
		@props.commandHandler @props.command, { option: event.target.value }

	render: ->
		selectedOption = @state.selectedOption

		opts = @props.command.options.map (option, index) ->
			React.createElement 'option', { key:index, value:option }, option
		if selectedOption is null
			opts.push React.createElement 'option', { key:-1, value:-1, selected:true }, '---'

		React.createElement 'select', {
			className: 'select'
			onChange: @onChange
			alt: @props.command.label
			value: selectedOption
		}, opts


module.exports = Select