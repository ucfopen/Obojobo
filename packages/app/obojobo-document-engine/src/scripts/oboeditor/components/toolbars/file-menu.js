import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import ClipboardUtil from '../../util/clipboard-util'
import EditorUtil from '../../util/editor-util'
import APIUtil from '../../../viewer/util/api-util'
import { downloadDocument } from '../../../common/util/download-document'

import DropDownMenu from './drop-down-menu'

const { Prompt } = Common.components.modal
const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

class FileMenu extends React.PureComponent {
	renameModule(moduleId, label) {
		ModalUtil.hide()
		EditorUtil.renameModule(moduleId, label)

		if (this.props.onRename) {
			this.props.onRename(label)
		}
	}

	renameAndSaveModule(moduleId, label) {
		this.renameModule(moduleId, label)
		this.props.onSave(this.props.draftId)
	}

	deleteModule() {
		return APIUtil.deleteDraft(this.props.draftId).then(result => {
			if (result.status === 'ok') {
				window.close()
			}
		})
	}

	copyModule(moduleId, label) {
		const oldLabel = this.props.model.title
		let draftId = null

		APIUtil.createNewDraft()
			.then(result => {
				draftId = result.value.id
				this.renameModule(moduleId, label)
				return this.props.onSave(draftId)
			})
			.then(() => {
				this.renameModule(moduleId, oldLabel)
				window.open(window.location.origin + '/editor/visual/' + draftId, '_blank')
			})
	}

	render() {
		const url = window.location.origin + '/view/' + this.props.draftId
		const menu = [
			{
				name: 'Save',
				type: 'action',
				action: () => this.props.onSave(this.props.draftId)
			},
			{
				name: 'New',
				type: 'action',
				action: () =>
					APIUtil.createNewDraft().then(result => {
						if (result.status === 'ok') {
							window.open(window.location.origin + '/editor/visual/' + result.value.id, '_blank')
						}
					})
			},
			{
				name: 'Make a copy',
				type: 'action',
				action: () =>
					ModalUtil.show(
						<Prompt
							title="Copy Module"
							message="Enter the title for the copied module:"
							value={this.props.model.title + ' - Copy'}
							onConfirm={this.copyModule.bind(this, this.props.model.id)}
						/>
					)
			},
			{
				name: 'Download',
				type: 'sub-menu',
				menu: [
					{
						name: 'XML Document (.xml)',
						type: 'action',
						action: () => downloadDocument(this.props.draftId, 'xml')
					},
					{
						name: 'JSON Document (.json)',
						type: 'action',
						action: () => downloadDocument(this.props.draftId, 'json')
					}
				]
			},
			{
				name: 'Rename',
				type: 'action',
				action: () =>
					ModalUtil.show(
						<Prompt
							title="Rename Module"
							message="Enter the new title for the module:"
							value={this.props.model.title}
							onConfirm={this.renameAndSaveModule.bind(this, this.props.model.id)}
						/>
					)
			},
			{
				name: 'Delete Module',
				type: 'action',
				action: () =>
					ModalUtil.show(
						<SimpleDialog cancelOk onConfirm={this.deleteModule.bind(this)}>
							{'Are you sure you want to delete ' +
								this.props.model.title +
								'? This will permanately delete all content in the module'}
						</SimpleDialog>
					)
			},
			{
				name: 'Copy LTI Link',
				type: 'action',
				action: () => ClipboardUtil.copyToClipboard(url)
			}
		]

		return (
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu name="File" menu={menu} />
			</div>
		)
	}
}

export default FileMenu
