require('./message-dialog.scss')

const React = require('react')
const Button = require('./button')

const MessageDialog = props => {
	return (
		<div className="bulk-success-dialog">
			<div className="success-message">{props.message}</div>
			<div className="wrapper">
				<Button className="done-button secondary-button" onClick={props.onClose}>
					OK
				</Button>
			</div>
		</div>
	)
}

module.exports = MessageDialog
