import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal
import { MEDIA, WEBPAGE } from './iframe-content-types'

import './new-iframe-modal.scss'

class NewIframeModal extends React.Component {
	constructor(props) {
		super(props)

		const defaultState = {
			src: '',
			contentType: MEDIA
		}

		this.state = { ...defaultState, ...props.content }

		this.inputRef = React.createRef();

		this.handleSourceChange = this.handleSourceChange.bind(this)
		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
	}

	componentDidMount() {
		this.inputRef.current.focus()
		this.inputRef.current.select()
	}

	focusOnFirstElement() {
		this.inputRef.current.focus()
	}

	handleSourceChange(event) {
		const src = event.target.value;
		const contentType = src.includes('<iframe') ? MEDIA : WEBPAGE;

		this.setState({ src, contentType });
	}

	render() {
		const previewContent =
			<div className='preview-with-iframe'>
				<iframe
					src={this.state.src}
				></iframe>
				<div>
					<p>Does the preview look good?</p>
					<button>No, the preview isn&apos;t working</button>
				</div>
			</div>

		return (
			<SimpleDialog
				cancelOrCustomYes
				customYes="Preview is good - Continue..."
				title="New Embedded IFrame"
				onConfirm={() => this.props.onConfirm(this.state)}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<div className='new-iframe-modal'>
					<header>
						<p>Paste either an iframe embed code or a URL to embed:</p>
						<input
							type='text'
							placeholder='<iframe src="https://example.com"/> or "https://example.com"'
							ref={this.inputRef}
							value={this.state.src || ''}
							onChange={this.handleSourceChange}
						/>
					</header>
					<div className='preview'>
						<p>Embedded preview:</p>
						{this.state.src ? (
							previewContent
						) : (
							<div className='no-preview'>
								<span>Paste a link or embed code above to see the preview</span>
							</div>
						)}
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default NewIframeModal
