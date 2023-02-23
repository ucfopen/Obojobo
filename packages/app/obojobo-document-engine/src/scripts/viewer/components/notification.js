import React from 'react'
import './notification.scss'

class Notification extends React.Component {
	constructor(props) {
		super(props)
		this.notificationRef = React.createRef()
	}

	render() {
		return (
			<div className="notification-banner nav-menu">
				<div className="notification-header">
					<h1>{this.props.title}</h1>
					<button onClick={this.props.onClick} className="notification-exit-button">
						X
					</button>
				</div>
				<p>{this.props.text}</p>
			</div>
		)
	}
}

export default Notification
