# Modal element should be a React component which implements onButtonClick. Here's an example:
#
# SimpleMessage = React.createClass
# 	render: ->
# 		`<div>
# 			<p>{this.props.children}</p>
# 			<button onClick={this.props.modal.onButtonClick.bind(this, this.props.confirm)}>
# 				{this.props.buttonLabel || 'OK'}
# 			</button>
# 		</div>`
#
# When the user clicks on the OK button in this example it will call onButtonClick,
# which will attempt to call the given SimpleMessage's confirm prop function, passing
# in a reference to this class, allowing the modal to be closed. If no confirm method
# exists then the modal will simply be closed.
#
# In addition, when the user clicks the cancel X the modal element's cancel button will be
# called if it exists - if not the dialog will be closed.
#
# The modal element can also include `showCancelButton={false}` to remove the cancel X.
# By default it will be shown.
#
# Usage example:
# 	example: ->
# 		...
# 		props.showModalFn <SimpleMessage confirm={this.onConfirm} cancel={this.onCancel} showCancelButton={false}>Some message here</SimpleMessage>
#
# 	onConfirm: (modal) ->
# 		console.log 'You clicked the confirm button'
# 		modal.close()
#
# 	onCancel: (modal) ->
# 		console.log 'You clicked the cancel button'
# 		modal.close()

Modal = React.createClass

	getInitialState: ->
		modalElement: null

	componentWillReceiveProps: (nextProps) ->
		if nextProps.modalElement?
			# Force the modal prop by cloning:
			cloneEl = React.cloneElement nextProps.modalElement, { modal:@ }

			@setState {
				modalElement: cloneEl
			}
		else if nextProps.modalElement is null
			@setState { modalElement:null }

	onButtonClick: (modalElementClickFn) ->
		if modalElementClickFn? then return modalElementClickFn @
		@close()

	close: -> @props.showModalFn null

	render: ->
		if @state.modalElement is null then return null

		# if not @state.modalElement.props.close then @state.modalElement

		React.createElement 'div', { style:{background:'rgba(0, 0, 0, 0.2)', position:'absolute', left:0, right:0, bottom:0, top:0} }, [
			React.createElement('div', { style:{background:'white', position:'absolute', left:'50%', top:'35%', transform:'translate(-50%,-50%)' }}, [
				if @state.modalElement.props.showCancelButton is false then null else React.createElement('button', {onClick:@onButtonClick.bind(@, @state.modalElement.props.cancel)}, 'X'),
				@state.modalElement
			])
		]


module.exports = Modal