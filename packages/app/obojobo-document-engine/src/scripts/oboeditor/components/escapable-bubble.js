//import './escapable-bubble.scss'

const { Bubble } = Common.components.modal.bubble
import React from 'react'

class EscapableBubble extends React.Component {
	constructor(props) {
		super(props)
		this.inputRef = React.createRef()
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClick, false)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false)
	}

	handleClick(event) {
		console.log('click?')
		console.log(this.node)
		if (!this.node || this.node.contains(event.target)) return

		console.log("outside?")
		this.handleOutsideClick()
	}

	handleOutsideClick() {
		return this.props.onClose()
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

	render() {
		return (
			<Bubble>
				<div ref={node => {
					this.node = node
				}} >
				Hello Darkness My old friend
				</div>
			</Bubble>
		)
	}
}

export default EscapableBubble
