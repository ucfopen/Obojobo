import React from 'react'
import Common from 'Common'
import { isIframeLoadedCorrectly } from './check-iframe-src'

const { SimpleDialog } = Common.components.modal
import IFrameContentTypes from './iframe-content-types'

import './new-iframe-modal.scss'

class NewIframeModal extends React.Component {
	constructor(props) {
		super(props)

		const defaultState = {
			src: '',
			width: 640,
			height: 480,
			srcFormatted: '',
			contentType: IFrameContentTypes.MEDIA
		}

		this.state = {
			...defaultState,
			...props.content,
			iframeLoaded: true,
			openPreviewNotWorkingSection: false
		}

		this.inputRef = React.createRef()

		this.handleSourceChange = this.handleSourceChange.bind(this)
		this.focusOnFirstElement = this.focusOnFirstElement.bind(this)
		this.openPreviewNotWorkingSection = this.openPreviewNotWorkingSection.bind(this)
	}

	componentDidMount() {
		this.inputRef.current.focus()
		this.inputRef.current.select()
	}

	focusOnFirstElement() {
		this.inputRef.current.focus()
	}

	handleSourceChange(event) {
		const src = event.target.value
		let srcFormatted,
			width,
			height = ''

		if (!isIframeLoadedCorrectly(src)) {
			this.setState({ src, iframeLoaded: false })
			return
		}

		const contentType = src.includes('<iframe')
			? IFrameContentTypes.MEDIA
			: IFrameContentTypes.WEBPAGE

		if (contentType === IFrameContentTypes.MEDIA) {
			// Extracting iframe's src address (if detected content type is MEDIA)
			srcFormatted = src
				.split('src="')
				.pop()
				.split('"')[0]

			// Extracting width and height as well
			width = src
				.split('width="')
				.pop()
				.split('"')[0]
			height = src
				.split('height="')
				.pop()
				.split('"')[0]
		} else {
			srcFormatted = src
		}

		this.setState({ src, srcFormatted, contentType, width, height, iframeLoaded: true })
	}

	openPreviewNotWorkingSection() {
		this.setState({ openPreviewNotWorkingSection: true })
	}

	render() {
		const previewContent = (
			<div className="preview-with-iframe">
				<iframe src={this.state.src}></iframe>
				<section>
					<p>Does the preview look good?</p>
					{this.state.openPreviewNotWorkingSection ? (
						<div className="preview-not-working">
							If the preview above is not what you expected, keep in mind that some pages inside
							your IFrame may restrict their content, thus not allowing them to be shown within
							Obojobo. Also, if you are trying to embed media instead of an IFrame, make sure to
							paste your IFrame&apos;s embed code (starting with &lt;iframe...) and not only the
							regular URL.
						</div>
					) : (
						<button onClick={this.openPreviewNotWorkingSection}>
							No, the preview isn&apos;t working
						</button>
					)}
				</section>
			</div>
		)

		return (
			<SimpleDialog
				cancelOrCustomYes
				customYes="Preview is good - Continue..."
				title="New Embedded IFrame"
				onConfirm={() => this.props.onConfirm(this.state)}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<div className="new-iframe-modal">
					<header>
						<p>Paste either an iframe embed code or a URL to embed:</p>
						<input
							type="text"
							placeholder='<iframe src="https://example.com"/> or "https://example.com"'
							ref={this.inputRef}
							value={this.state.src || ''}
							onChange={this.handleSourceChange}
						/>
					</header>
					<div className="preview">
						<p>Embedded preview:</p>
						{this.state.src && this.state.iframeLoaded ? (
							previewContent
						) : (
							<div className="no-preview">
								{this.state.iframeLoaded || this.state.src === '' ? (
									<span>Paste a link or embed code above to see the preview</span>
								) : (
									<span>Make sure you are using a valid URL or an IFrame embed code</span>
								)}
							</div>
						)}
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default NewIframeModal
