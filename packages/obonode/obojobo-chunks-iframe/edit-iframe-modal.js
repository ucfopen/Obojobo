import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal

import './edit-iframe-modal.scss'

class EditIframeModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			autoload: false
		}

		this.inputRef = React.createRef();

		this.onChangeAutoload = this.onChangeAutoload.bind(this);
	}

	onChangeAutoload(event) {
		const autoload = event.target.value
		this.setState({ autoload });
	}

	render() {
		console.log(this.props.element.content)
		return (
			<SimpleDialog
				cancelOk
				title="Edit Embedded IFrame"
				onConfirm={() => this.props.onConfirm(this.state)}
				onCancel={this.props.onCancel}
				focusOnFirstElement={this.focusOnFirstElement}
			>
				<header>
					<label htmlFor='src-input'>Source</label>
					<input
						id='src-input'
						disabled
						value={''}
					/>
					<button>Change...</button>
				</header>
				<div className='content-type'>
					<label htmlFor='content-type-container'>Content Type</label>
					<div id='content-type-label'>
						<label htmlFor='video-or-media'>
							<input
								id='video-or-media'
								type='checkbox'
							/>
							<div className='video-or-media-icon'></div>
							<span>Video or other media</span>
						</label>
						<label htmlFor='embedded-webpage'>
							<input
								id='embedded-webpage'
								type='checkbox'
							/>
							<div className='embedded-webpage-icon'></div>
							<span>Embedded webpage</span>
						</label>
					</div>
				</div>
				<p className='title'>Options</p>
				<div className='sizing'>
					<label htmlFor='sizing-container'>Sizing</label>
					<div id='sizing-container'>
						<label htmlFor='max-width'>
							<input
								id='max-width'
								type='checkbox'
							/>
							<div className='max-width-icon'></div>
							<p>Responsive - full width</p>
							<small>Grows up to the largest size (wider thant text)</small>
						</label>
						<label htmlFor='text-width'>
							<input
								id='text-width'
								type='checkbox'
							/>
							<div className='text-width-icon'></div>
							<p>Responsive - text width</p>
							<small>Grows up to the same width as the text</small>
						</label>
						<label htmlFor='fixed-width'>
							<input
								id='fixed-width'
								type='checkbox'
							/>
							<div className='fixed-width-icon'></div>
							<p>Fixed size</p>
							<small>Shows at set pixel dimensions</small>
						</label>
					</div>
					<button>Edit dimensions</button>
				</div>
				<div className='loading-container'>
					<label htmlFor='loading-select'>
						Loading:
						<select id='loading-select' onChange={this.onChangeAutoload}>
							<option value={false}>Load when student sees IFrame</option>
							<option value={true}>Load right away (Not recommended)</option>
						</select>
					</label>
					{this.state.autoload && (
						<small>This option might cause your module to load or run slowly</small>
					)}
				</div>
				<div className='title-container'>
					<label htmlFor='title-input'>
						Title:
						<input
							id='title-input'
							type='text'
						/>
					</label>
					<small>This will be shown before the IFrame is loaded</small>
				</div>
				<button>Show all options (advanced)...</button>
			</SimpleDialog>
		)
	}
}

export default EditIframeModal;
