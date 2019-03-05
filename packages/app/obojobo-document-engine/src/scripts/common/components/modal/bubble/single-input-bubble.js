import './single-input-bubble.scss'

import Bubble from './bubble'
import React from 'react'

class SingleInputBubble extends React.Component {
	constructor(props) {
		super(props)
		this.inputRef = React.createRef()
	}

	onChange(event) {
		return this.props.onChange(event.target.value)
	}

	onSubmit(event) {
		event.preventDefault()
		return this.props.onClose()
	}

	onKeyUp(event) {
		if (event.keyCode === 27) {
			//ESC
			return this.props.onCancel()
		}
	}

	componentDidMount() {
		return setTimeout(() => {
			return this.inputRef.current.select()
		})
	}

	render() {
		return (
			<Bubble>
				<label className="single-input-bubble">
					<form className="interactable" onSubmit={this.onSubmit.bind(this)}>
						<input
							ref={this.inputRef}
							type="text"
							value={this.props.value}
							onChange={this.onChange.bind(this)}
							onKeyUp={this.onKeyUp.bind(this)}
						/>
						<button onClick={this.onSubmit.bind(this)}>Ok</button>
					</form>
					<span className="label">{this.props.label}</span>
				</label>
			</Bubble>
		)
	}
}

export default SingleInputBubble
