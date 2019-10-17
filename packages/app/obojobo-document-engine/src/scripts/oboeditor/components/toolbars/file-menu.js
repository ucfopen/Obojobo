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

class FileMenu extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			drafts: []
		}
	}

	componentDidMount() {
		APIUtil.getAllDrafts().then(result => {
			this.setState({
				drafts: result.value
					.map(draft => {
						if (draft.draftId === this.props.draftId) return null

						return {
							name: draft.title,
							type: 'action',
							action: () =>
								window.open(window.location.origin + '/editor/' + this.props.mode + '/' + draft.draftId, '_blank')
						}
					})
					.filter(Boolean)
			})
		})
	}

	renameModule(moduleId, label) {
		ModalUtil.hide()

		// If the module name is empty or just whitespace, provide a default value
		if (!label || !/[^\s]/.test(label)) label = '(Unnamed Module)'

		EditorUtil.renamePage(moduleId, label)

		if(this.props.onRename) {
			this.props.onRename(label)
		}
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
				window.open(window.location.origin + '/editor/' + this.props.mode + '/' + draftId, '_blank')
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

	render() {
		const url = window.location.origin + '/view/' + this.props.draftId
		const menu = [
			{
				name: 'Save',
				type: 'action',
				action: () =>
					this.props.onSave(this.props.draftId).then(result => {
						if (result.status === 'ok') {
							ModalUtil.show(<SimpleDialog ok title={'Successfully saved draft'} />)
						} else {
							ModalUtil.show(<SimpleDialog ok title={'Error: ' + result.value.message} />)
						}
					})
			},
			{
				name: 'New',
				type: 'action',
				action: () =>
					APIUtil.createNewDraft().then(result => {
						if (result.status === 'ok') {
							window.open(window.location.origin + '/editor/' + this.props.mode + '/' + result.value.id, '_blank')
						}
					})
			},
			{
				name: 'Open',
				type: 'sub-menu',
				menu: this.state.drafts
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
							onConfirm={this.renameModule.bind(this, this.props.model.id)}
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
			<div
				className="visual-editor--drop-down-menu">
				<DropDownMenu name="File" menu={menu} />
			</div>
		)
	}
}

export default FileMenu
