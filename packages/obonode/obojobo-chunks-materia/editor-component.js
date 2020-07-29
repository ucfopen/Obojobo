import React from 'react'
import { ReactEditor } from 'slate-react'
import { Editor, Transforms } from 'slate'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import {
	freezeEditor,
	unfreezeEditor
} from 'obojobo-document-engine/src/scripts/oboeditor/util/freeze-unfreeze-editor'
import MateriaSettingsDialog from './materia-settings-dialog'
import './viewer-component.scss'
import './editor-component.scss'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import Button from 'obojobo-document-engine/src/scripts/common/components/button'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

class MateriaEditor extends React.Component {
	constructor(props) {
		super(props)
		this.focusMe = this.focusMe.bind(this)
		this.deleteNode = this.deleteNode.bind(this)
		this.showMateriaSettingsDialog = this.showMateriaSettingsDialog.bind(this)
		this.changeProperties = this.changeProperties.bind(this)
		this.returnFocusOnShiftTab = this.returnFocusOnShiftTab.bind(this)
		this.returnFocusOnTab = this.returnFocusOnTab.bind(this)
		this.onCloseMateriaSettingsDialog = this.onCloseMateriaSettingsDialog.bind(this)
	}

	focusMe() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const start = Editor.start(this.props.editor, path)
		Transforms.setSelection(this.props.editor, {
			focus: start,
			anchor: start
		})
	}

	showMateriaSettingsDialog(event) {
		event.preventDefault()
		event.stopPropagation()
		ModalUtil.show(
			<MateriaSettingsDialog
				content={this.props.element.content}
				onConfirm={this.changeProperties}
				onCancel={this.onCloseMateriaSettingsDialog}
			/>
		)
		freezeEditor(this.props.editor)
	}

	onCloseMateriaSettingsDialog() {
		ModalUtil.hide()
		unfreezeEditor(this.props.editor)
	}

	changeProperties(content) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, ...content } },
			{ at: path }
		)
		this.onCloseMateriaSettingsDialog()
	}

	getTitle(src, title) {
		if (src === null) {
			return 'No widget linked'
		}

		return title || src
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
		const selected = this.props.selected
		const className =
			'obojobo-draft--chunks--materia viewer pad is-previewing ' +
			isOrNot(content.border, 'bordered') +
			' is-not-showing ' +
			' is-controls-enabled ' +
			isOrNot(!content.src, 'missing-src') +
			isOrNot(content.initialZoom > 1, 'scaled-up')

		return (
			<Node {...this.props}>
				<div className={className}>
					<div className="obojobo-draft--revealable-container-wrapper">
						<div
							className={`obojobo-draft--revealable-container editor-container ${isOrNot(selected, 'selected')}`}
							style={{userSelect: 'none'}}
							onClick={this.focusMe}
						>
							<Button
								className="delete-button"
								onClick={this.deleteNode}
								onKeyDown={this.returnFocusOnShiftTab}
								tabIndex={selected ? 0 : -1}
							>
								×
							</Button>
							<div >
								{content.icon
									? <div className="widget-icon" contentEditable={false}><img src={content.icon} alt={content.widgetEngine} /></div>
									: null
								}
								<Button
									className="properties-button"
									onClick={this.showMateriaSettingsDialog}
									onKeyDown={this.returnFocusOnTab}
									tabIndex={selected ? 0 : -1}
								>
									Widget Settings...
								</Button>
							</div>
						</div>
					</div>

					<div className="obojobo-draft--chunk-caption" aria-hidden contentEditable={false}>
						{this.getTitle(content.src || null, content.title)}
					</div>

					{this.props.children}
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(MateriaEditor)
