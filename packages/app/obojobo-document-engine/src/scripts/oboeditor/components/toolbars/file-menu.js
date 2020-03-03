import React from 'react'
import download from 'downloadjs'
import Common from 'obojobo-document-engine/src/scripts/common'

import ClipboardUtil from '../../util/clipboard-util'
import EditorUtil from '../../util/editor-util'
import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'

import DropDownMenu from './drop-down-menu'

const { Prompt } = Common.components.modal
const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

const processFile = (e, file) => {
	const contents = e.target.result

	APIUtil.createNewDraftWithContent(
		contents,
		file.type === 'application/json' ? 'application/json' : 'text/plain;charset=UTF-8'
	)
		.then(id => {
			window.open(window.location.origin + '/editor/visual/' + id, '_blank')
		})
		.catch(() => {
			ModalUtil.show(
				<SimpleDialog ok onConfirm={ModalUtil.hide}>
					Unexpected error occurred while uploading
				</SimpleDialog>
			)
		})
}

class FileMenu extends React.PureComponent {
	renameModule(moduleId, label) {
		ModalUtil.hide()

		// If the module name is empty or just whitespace, provide a default value
		if (!label || !/[^\s]/.test(label)) label = '(Unnamed Module)'

		EditorUtil.renamePage(moduleId, label)

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
		this.renameModule(moduleId, label)

		let draftId = null

		APIUtil.createNewDraft()
			.then(result => {
				draftId = result.value.id
				return this.props.onSave(draftId)
			})
			.then(() => {
				window.open(window.location.origin + '/editor/visual/' + draftId, '_blank')
			})
	}

	downloadModule(draftId, format) {
		let formatResults

		switch (format) {
			case 'json':
				formatResults = text => {
					const json = JSON.parse(text)
					return JSON.stringify(json, null, 2)
				}
				break

			default:
				formatResults = text => text
				break
		}

		APIUtil.getFullDraft(draftId, format)
			.then(formatResults)
			.then(contents => {
				download(contents, `obojobo-draft-${draftId}.${format}`, `application/${format}`)
			})
	}

	onChangeFile(event) {
		const file = event.target.files[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = e => processFile(e, file)
		reader.readAsText(file, 'UTF-8')
	}

	buildFileSelector() {
		const fileSelector = document.createElement('input')
		fileSelector.setAttribute('type', 'file')
		fileSelector.setAttribute('accept', 'application/JSON, application/XML')

		fileSelector.onchange = this.onChangeFile

		return fileSelector
	}

	render() {
		const url = window.location.origin + '/view/' + this.props.draftId
		const menu = [
			{
				name: 'Import from file...',
				type: 'action',
				action: () => {
					const fileSelector = this.buildFileSelector()
					fileSelector.click()
				}
			},
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
						action: () => this.downloadModule(this.props.draftId, 'xml')
					},
					{
						name: 'JSON Document (.json)',
						type: 'action',
						action: () => this.downloadModule(this.props.draftId, 'json')
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
				name: 'Delete',
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
