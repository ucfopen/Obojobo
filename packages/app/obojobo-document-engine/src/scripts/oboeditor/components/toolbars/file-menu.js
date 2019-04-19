import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import ClipboardUtil from '../../util/clipboard-util'
import EditorUtil from '../../util/editor-util'
import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'

import DropDownMenu from './drop-down-menu'

const { Prompt } = Common.components.modal
const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

class FileMenu extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			drafts: []
		}
	}

	componentDidMount() {
		APIUtil.getAllDrafts().then(result => {
			this.setState({
				drafts: result.value.map(draft => {
					if(draft.draftId === this.props.draftId) return null

					return {
						name: draft.title,
						type: 'action',
						action: () => window.open(window.location.origin + '/editor/' + draft.draftId, '_blank')
					}
				}).filter(Boolean)
			})
		})
	}

	renameModule(moduleId, label) {
		ModalUtil.hide()

		// If the module name is empty or just whitespace, provide a default value
		if (!label || !/[^\s]/.test(label)) label = '(Unnamed Module)'

		EditorUtil.renamePage(moduleId, label)
	}

	deleteModule() {
		return APIUtil.deleteDraft(this.props.draftId).then(result => {
			if(result.status === 'ok'){
				window.close()
			}
		})
	}

	saveModule(draftId) {
		this.props.exportToJSON()
		const json = this.props.model.flatJSON()

		// deal with content
		this.props.model.children.forEach(child => {
			let contentJSON = {}

			switch (child.get('type')) {
				case CONTENT_NODE:
					contentJSON = child.flatJSON()

					for (const item of Array.from(child.children.models)) {
						contentJSON.children.push({
							id: item.get('id'),
							type: item.get('type'),
							content: item.get('content'),
							children: item.get('children')
						})
					}
					break

				case ASSESSMENT_NODE:
					contentJSON.id = child.get('id')
					contentJSON.type = child.get('type')
					contentJSON.children = child.get('children')
					contentJSON.content = child.get('content')
					break
			}

			json.children.push(contentJSON)
		})

		return APIUtil.postDraft(draftId, json)
	}

	copyModule(moduleId, label) {
		this.renameModule(moduleId, label)

		let draftId = null

		APIUtil.createNewDraft()
			.then(result => {
				draftId = result.value.id
				return this.saveModule(draftId)
			})
			.then(result => {
				if(result.status === 'ok'){
					window.open(window.location.origin + '/editor/' + draftId, '_blank')
				}
			})
	}

	render() {
		const url = window.location.origin + '/view/' + this.props.draftId
		const menu = {
			name: 'File',
			menu: [
				{
					name: 'Save',
					type: 'action',
					action: () => this.saveModule(this.props.draftId).then(result => {
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
					action: () => APIUtil.createNewDraft().then(result => {
						if(result.status === 'ok'){
							window.open(window.location.origin + '/editor/' + result.value.id, '_blank')
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
					action: () => ModalUtil.show(
						<Prompt
							title="Copy Module"
							message="Enter the title for the copied module:"
							value={this.props.model.title + ' - Copy'}
							onConfirm={this.copyModule.bind(this, this.props.model.id)}
						/>
					)
				},
				{
					name: 'Rename',
					type: 'action',
					action: () => ModalUtil.show(
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
					action: () => ModalUtil.show(
						<SimpleDialog
							cancelOk
							onConfirm={this.deleteModule.bind(this)}>
							{'Are you sure you want to delete ' + this.props.model.title + '? This will permanately delete all content in the module'}
						</SimpleDialog>
					)
				},
				{
					name: 'Copy LTI Link',
					type: 'action',
					action: () => ClipboardUtil.copyToClipboard(url)
				}
			]
		}

		return <DropDownMenu menu={menu}/>
	}
}

export default FileMenu
