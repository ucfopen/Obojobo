import React from 'react'

class YouTube extends React.Component {
	constructor(props) {
		super(props)
	}

	handleSourceChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					videoId: event.target.value
				}
			}
		})
		editor.onChange(change)
	}

	render() {
		const { isFocused } = this.props
		const content = this.props.node.data.get('content')

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
			<div className={'obojobo-draft--chunks--you-tube viewer pad'}>
				<div style={maskStyle} />
				<iframe
					src={'https://www.youtube.com/embed/' + content.videoId}
					frameBorder="0"
					allowFullScreen="true"
				/>
				<input
					value={content.videoId}
					aria-label={'Youtube Video Id'}
					onChange={event => this.handleSourceChange(event)}
					onClick={event => event.stopPropagation()}
				/>
			</div>
		)
	}
}

export default YouTube
