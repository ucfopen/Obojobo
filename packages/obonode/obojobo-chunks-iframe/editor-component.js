import './viewer-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

import IframeProperties from './iframe-properties-modal'

import './editor-component.scss'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

class IFrame extends React.Component {
	constructor(props) {
		super(props)
	}

	showIFramePropertiesModal() {
		ModalUtil.show(
			<IframeProperties
				content={this.props.node.data.get('content')}
				onConfirm={this.changeProperties.bind(this)}
			/>
		)
	}

	changeProperties(content) {
		const editor = this.props.editor

		return editor.setNodeByKey(this.props.node.key, {
			data: {
				content
			}
		})
	}

	getTitle(src, title) {
		if (src === null) {
			return 'IFrame missing src attribute'
		} else if (title) {
			return title
		}

		return src.replace(/^https?:\/\//, '')
	}

	render() {
		const content = this.props.node.data.get('content')

		const previewStyle = {
			height: (content.height || '500') + 'px'
		}

		const className =
			'obojobo-draft--chunks--iframe viewer pad is-previewing ' +
			isOrNot(content.border, 'bordered') +
			' is-not-showing ' +
			' is-controls-enabled ' +
			isOrNot(!content.src, 'missing-src') +
			isOrNot(content.initialZoom > 1, 'scaled-up')

		const contentDescription = [
			{
				name: 'src',
				description: 'Source',
				type: 'input'
			},
			{
				name: 'title',
				description: 'Title',
				type: 'input'
			},
			{
				name: 'type',
				description: 'Type',
				type: 'select',
				values: [
					{
						value: 'media',
						description: 'Media'
					},
					{
						value: 'webpage',
						description: 'Webpage'
					}
				]
			},
			{
				name: 'border',
				description: 'Display Border',
				type: 'toggle'
			},
			{
				name: 'fit',
				description: 'Display',
				type: 'select',
				values: [
					{
						value: 'scale',
						description: 'Scale down width, height, and content'
					},
					{
						value: 'scroll',
						description: 'Reduce width, but maintain height'
					}
				]
			},
			{
				name: 'width',
				description: 'Width',
				type: 'input'
			},
			{
				name: 'height',
				description: 'Height',
				type: 'input'
			},
			{
				name: 'initialZoom',
				description: 'Zoom',
				type: 'input'
			},
			{
				name: 'autoload',
				description: 'Autoload',
				type: 'toggle'
			},
			{
				name: 'controls',
				description: 'Controls',
				type: 'input'
			},
		]

		return (
			<Node {...this.props} contentDescription={contentDescription}>
				<div className={className}>
					<div className={'editor-container'} style={previewStyle}>
						<div className="iframe-toolbar">
							<span className="title" aria-hidden>
								{this.getTitle(content.src || null, content.title)}
							</span>
							<Button
								className="properties-button"
								onClick={this.showIFramePropertiesModal.bind(this)}
							>
								IFrame Properties
							</Button>
						</div>
					</div>
				</div>
			</Node>
		)
	}
}

export default IFrame
