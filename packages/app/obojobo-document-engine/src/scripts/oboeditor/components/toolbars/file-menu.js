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
	deleteModule() {
		return APIUtil.deleteDraft(this.props.draftId).then(result => {
			if (result.status === 'ok') {
				window.close()
			}
		})
	}

	copyModule(newTitle) {
		APIUtil.copyDraft(this.props.draftId, newTitle)
			.then(result => {
				ModalUtil.hide()
				window.open(window.location.origin + '/editor/visual/' + result.value.draftId, '_blank')
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
							value={this.props.title + ' - Copy'}
							onConfirm={this.copyModule.bind(this)}
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
				name: 'Delete Module',
				type: 'action',
				action: () =>
					ModalUtil.show(
						<SimpleDialog cancelOk onConfirm={this.deleteModule.bind(this)}>
							{'Are you sure you want to delete "' +
								this.props.title +
								'"? This will permanately delete all content in the module'}
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
