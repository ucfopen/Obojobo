import './viewer-component.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import { Editor, Transforms } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import {
	freezeEditor,
	unfreezeEditor
} from 'obojobo-document-engine/src/scripts/oboeditor/util/freeze-unfreeze-editor'

import NewIframeModal from './new-iframe-modal'
import EditIframeModal from './edit-iframe-modal'

import './editor-component.scss'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

class IFrame extends React.Component {
	constructor(props) {
		super(props)
		this.deleteNode = this.deleteNode.bind(this)
		this.focusIframe = this.focusIframe.bind(this)
		this.returnFocusOnTab = this.returnFocusOnTab.bind(this)
		this.changeProperties = this.changeProperties.bind(this)
		this.showNewIframeModal = this.showNewIframeModal.bind(this)
		this.openEditIframeModal = this.openEditIframeModal.bind(this)
		this.onCloseAnIFrameModal = this.onCloseAnIFrameModal.bind(this)
		this.returnFocusOnShiftTab = this.returnFocusOnShiftTab.bind(this)
	}

	focusIframe() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const start = Editor.start(this.props.editor, path)
		Transforms.setSelection(this.props.editor, {
			focus: start,
			anchor: start
		})
	}

	showNewIframeModal(event, src) {
		event.preventDefault()
		event.stopPropagation()
		const content = Object.assign({}, this.props.element.content)
		content.src = src

		ModalUtil.show(
			<NewIframeModal
				content={content}
				onConfirm={this.openEditIframeModal}
				onCancel={this.onCloseAnIFrameModal}
			/>
		)

		freezeEditor(this.props.editor)
	}

	onCloseAnIFrameModal() {
		ModalUtil.hide()
		unfreezeEditor(this.props.editor)
	}

	openEditIframeModal(content) {
		// Closes new IFrame modal
		this.onCloseAnIFrameModal()

		// Opens edit IFrame modal
		ModalUtil.show(
			<EditIframeModal
				content={content}
				onConfirm={this.changeProperties}
				onCancel={this.onCloseAnIFrameModal}
				goBack={this.showNewIframeModal}
			/>
		)

		freezeEditor(this.props.editor)
	}

	changeProperties(content) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, ...content } },
			{ at: path }
		)

		this.onCloseAnIFrameModal()
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
				<div className={className} contentEditable={false}>
					<div
						className={`editor-container  ${isSelected}`}
						style={previewStyle}
						onClick={this.focusIframe}
					>
						<Button
							className="delete-button"
							onClick={this.deleteNode}
							onKeyDown={this.returnFocusOnShiftTab}
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
								onClick={this.showNewIframeModal}
								onKeyDown={this.returnFocusOnTab}
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
