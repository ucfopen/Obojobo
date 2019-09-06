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

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

class ViewMenu extends React.Component {
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
								window.open(window.location.origin + '/editor/' + draft.draftId, '_blank')
						}
					})
					.filter(Boolean)
			})
		})
	}

	render() {
		const previewURL = window.location.origin + '/preview/' + this.props.draftId
		const menu = {
			name: 'View',
			menu: [
				{
					name: 'Edit With...',
					type: 'sub-menu',
					menu: [
						{
							name: 'JSON Editor',
							type: 'action',
							action: () => {
								this.props.onSave(this.props.draftId)
								this.props.switchMode(JSON_MODE)
							}
						},
						{
							name: 'XML Editor',
							type: 'action',
							action: () => {
								this.props.onSave(this.props.draftId)
								this.props.switchMode(XML_MODE)
							}
						},
						{
							name: 'Visual Editor',
							type: 'action',
							action: () => {
								this.props.onSave(this.props.draftId)
								this.props.switchMode(VISUAL_MODE)
							}
						}
					]
				},
				{
					name: 'Preview Module',
					type: 'action',
					action: () => window.open(previewURL, '_blank')
				},
			]
		}

		return <DropDownMenu menu={menu} />
	}
}

export default ViewMenu
