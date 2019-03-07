import React from 'react'

class IFrame extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	handleSourceChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					src: event.target.value
				}
			}
		})
		editor.onChange(change)
	}

	renderInput() {
		return (
			<div>
				<input
					value={this.props.node.data.get('content').src}
					onChange={event => this.handleSourceChange(event)}
					onClick={event => event.stopPropagation()}
				/>
			</div>
		)
	}

	renderFrame() {
		const { isFocused } = this.props

		const wrapperStyle = {
			position: 'relative',
			outline: isFocused ? '2px solid blue' : 'none'
		}

		const maskStyle = {
			display: isFocused ? 'none' : 'block',
			position: 'absolute',
			top: '0',
			left: '0',
			height: '100%',
			width: '100%',
			cursor: 'cell',
			zIndex: 1
		}

		return (
			<div className={'obojobo-draft--chunks--iframe viewer'} style={wrapperStyle}>
				<div style={maskStyle} />
				<iframe
					is
					src={this.props.node.data.get('content').src}
					frameBorder="0"
					allowFullScreen="true"
				/>
			</div>
		)
	}

	render() {
		return (
			<div className={'component'}>
				{this.renderFrame()}
				{this.props.isSelected ? this.renderInput() : null}
			</div>
		)
	}
}

export default IFrame
