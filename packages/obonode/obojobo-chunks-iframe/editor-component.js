import './viewer-component.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import { Editor, Transforms } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

import IframeProperties from './iframe-properties-modal'

import './editor-component.scss'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

class IFrame extends React.Component {
	focusIframe() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const start = Editor.start(this.props.editor, path)
		Transforms.setSelection(this.props.editor, {
			focus: start,
			anchor: start
		})
	}

	showIFramePropertiesModal() {
		ModalUtil.show(
			<IframeProperties
				content={this.props.element.content}
				onConfirm={this.changeProperties.bind(this)}
			/>
		)
	}

	changeProperties(content) {
		ModalUtil.hide()
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, ...content } },
			{ at: path }
		)
	}

	getTitle(src, title) {
		if (src === null) {
			return 'IFrame missing src attribute'
		} else if (title) {
			return title
		}

		return src.replace(/^https?:\/\//, '')
	}

	deleteNode() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.removeNodes(this.props.editor, { at: path })
	}

	returnFocusOnTab(event) {
		if (event.key === 'Tab' && !event.shiftKey) {
			event.preventDefault()
			return ReactEditor.focus(this.props.editor)
		}
	}

	returnFocusOnShiftTab(event) {
		if (event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			return ReactEditor.focus(this.props.editor)
		}
	}

	render() {
		const content = this.props.element.content
		const { selected } = this.props

		const previewStyle = {
			height: (content.height || '500') + 'px',
			userSelect: 'none'
		}

		const className =
			'obojobo-draft--chunks--iframe viewer pad is-previewing ' +
			isOrNot(content.border, 'bordered') +
			' is-not-showing ' +
			' is-controls-enabled ' +
			isOrNot(!content.src, 'missing-src') +
			isOrNot(content.initialZoom > 1, 'scaled-up')

		const isSelected = isOrNot(selected, 'selected')

		return (
			<Node {...this.props}>
				<div className={className}>
					<div
						className={`editor-container  ${isSelected}`}
						style={previewStyle}
						onClick={this.focusIframe.bind(this)}
					>
						<Button
							className="delete-button"
							onClick={this.deleteNode.bind(this)}
							onKeyDown={this.returnFocusOnShiftTab.bind(this)}
							tabIndex={selected ? 0 : -1}
						>
							×
						</Button>
						<div className="iframe-toolbar">
							<span className="title" aria-hidden contentEditable={false}>
								{this.getTitle(content.src || null, content.title)}
							</span>
							<Button
								className="properties-button"
								onClick={this.showIFramePropertiesModal.bind(this)}
								onKeyDown={this.returnFocusOnTab.bind(this)}
								tabIndex={selected ? 0 : -1}
							>
								IFrame Properties
							</Button>
						</div>
					</div>
				</div>
				{this.props.children}
			</Node>
		)
	}
}

export default withSlateWrapper(IFrame)
