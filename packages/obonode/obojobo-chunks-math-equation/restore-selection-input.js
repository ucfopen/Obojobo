import React from 'react'

class RestoreSelectionInput extends React.Component {
	constructor(props) {
		super(props)

		this.inputRef = React.createRef()
		this.onChange = this.onChange.bind(this)
	}

	onChange(event) {
		event.stopPropagation()

		this.selectionStart = event.target.selectionStart
		this.selectionEnd = event.target.selectionEnd

		this.props.onChange(event)
	}

	componentDidUpdate() {
		if (!this.inputRef.current || !Number.isFinite(this.selectionStart)) {
			return
		}

		this.inputRef.current.setSelectionRange(this.selectionStart, this.selectionEnd)
	}

	render() {
		const copiedProps = Object.assign({}, this.props)
		delete copiedProps.ref
		delete copiedProps.onChange

		return <input ref={this.inputRef} onChange={this.onChange} {...copiedProps} />
	}
}

export default RestoreSelectionInput
