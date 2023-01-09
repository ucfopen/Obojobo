require('./bulk-success-dialog.scss')

const React = require('react')
const Button = require('./button')

const CollectionOptionsDialog = props => {
	return (
		<div className="bulk-success-dialog">
			<div className="success-message">Modules Added Successfully!</div>
			<div className="wrapper">
				<Button className="done-button secondary-button" onClick={props.onClose}>
					OK
				</Button>
			</div>
		</div>
	)
}

module.exports = CollectionOptionsDialog
