import './single-input-bubble.scss'

import Bubble from './bubble'
import React from 'react'

class SingleInputBubble extends React.Component {
	constructor(props) {
		super(props)
		this.inputRef = React.createRef()
		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onKeyUp = this.onKeyUp.bind(this)
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
					<form className="interactable" onSubmit={this.onSubmit}>
						<input
							ref={this.inputRef}
							type="text"
							value={this.props.value}
							onChange={this.onChange}
							onKeyUp={this.onKeyUp}
						/>
						<button onClick={this.onSubmit}>Ok</button>
					</form>
					<span className="label">{this.props.label}</span>
				</label>
			</Bubble>
		)
	}
}

export default SingleInputBubble
