React = require 'react'


Modal = React.createClass

	getInitialState: ->
		modalElement: null

	componentWillReceiveProps: (nextProps) ->
		@setState {
			modalElement: nextProps.modalElement
		}

	close: ->
		@props.showModalFn null

	render: ->
		#@TODO
		if @state.modalElement is null
			return React.createElement 'div'

		React.createElement 'div', { style:{background:'rgba(0, 0, 0, 0.2)', position:'absolute', left:0, right:0, bottom:0, top:0} }, [
			React.createElement('div', { style:{background:'white', position:'absolute', left:'50%', top:'35%', transform:'translate(-50%,-50%)' }},
				React.createElement @state.modalElement, { close:@close }
			)
		]


module.exports = Modal