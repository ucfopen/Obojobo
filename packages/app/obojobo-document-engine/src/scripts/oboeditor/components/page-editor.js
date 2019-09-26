import './page-editor.scss'

import APIUtil from '../../viewer/util/api-util'
import Common from '../../common'
import { Editor } from 'slate-react'
import EditorStore from '../stores/editor-store'
import MarkToolbar from './toolbar'
import React from 'react'
import { Value } from 'slate'
import Component from './node/editor'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util
const { Button } = Common.components
const ToolBarComponent = MarkToolbar.components.Node

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

class PageEditor extends React.Component {
	constructor(props) {
		super(props)
		// @TODO - should this be hard coded by type?
		// ask the registry for the assessment
		this.assessment = Common.Registry.getItemForType(ASSESSMENT_NODE)

		this.onChange = this.onChange.bind(this)
		this.getEditor = this.getEditor.bind(this)
		this.ref = this.ref.bind(this)
		this.saveDraft = this.saveDraft.bind(this)

		const json = this.importFromJSON()

		this.state = {
			value: Value.fromJSON(json)
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Deal with deleted page
		if (!this.props.page) {
			return
		}

		if (!prevProps.page) {
			this.setState({ value: Value.fromJSON(this.importFromJSON()) })
			return
		}

		// Save changes when switching pages
		if (prevProps.page.id !== this.props.page.id) {
			this.exportToJSON(prevProps.page, prevState.value)
			this.setState({ value: Value.fromJSON(this.importFromJSON()) })
		}
	}

	renderEmpty() {
		return <p>No content available, click on a page to start editing</p>
	}

	ref(editor) {
		this.editor = editor
	}

	render() {
		if (this.props.page === null) return this.renderEmpty()

		return (
			<div className="editor--page-editor">
				<div className="toolbar">
					<ToolBarComponent getEditor={this.getEditor} />
				</div>
				<Editor
					className="component obojobo-draft--pages--page"
					value={this.state.value}
					ref={this.ref}
					onChange={this.onChange}
					plugins={this.props.plugins}
				/>
				<div className="footer-menu">
					<Button className="exporter" onClick={this.saveDraft}>
						Save Document
					</Button>
				</div>
			</div>
		)
	}

	getEditor() {
		return this.editor
	}

	onChange(change) {
		// Check if any nodes have been changed
		const nodesChanged = change.operations
			.toJSON()
			.some(
				operation =>
					operation.type === 'set_node' ||
					operation.type === 'insert_node' ||
					operation.type === 'add_mark' ||
					operation.type === 'set_mark'
			)

		if (nodesChanged) {
			// Hacky solution: editor changes need an uninterrupted React render cycle
			// Calling ModalUtil.hide right after Modals are finished interrupts this asyncronously
			// This hack only works because Modals are not directly a part of the Slate Editor
			ModalUtil.hide()
		}

		this.setState({ value: change.value })
	}

	exportToJSON(page, value) {
		if (page.get('type') === ASSESSMENT_NODE) {
			const json = this.assessment.slateToObo(value.document.nodes.get(0))
			page.set('children', json.children)
			page.set('content', json.content)
			return json
		} else {
			// Build page wrapper
			const json = {}
			json.children = []

			value.document.nodes.forEach(child => {
				const oboChild = Component.helpers.slateToObo(child)
				json.children.push(oboChild)
			})

			page.set('children', json.children)

			return json
		}
	}

	importFromJSON() {
		const json = { document: { nodes: [] } }
		const { page } = this.props

		if (!page) return json // if page is empty, exit

		if (page.get('type') === ASSESSMENT_NODE) {
			json.document.nodes.push(this.assessment.oboToSlate(page))
		} else {
			page.attributes.children.forEach(child => {
				json.document.nodes.push(Component.helpers.oboToSlate(child))
			})
		}

		return json
	}

	saveDraft() {
		const startPage = EditorStore.state.startingId
		this.exportToJSON(this.props.page, this.state.value)
		const json = this.props.model.flatJSON()
		json.content.start = startPage

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

		APIUtil.postDraft(this.props.draftId, json)
			.then(result => {
				const title =
					result.status === 'ok' ? 'Successfully saved draft' : 'Error: ' + result.value.message
				ModalUtil.show(<SimpleDialog ok title={title} />)
			})
			.catch(error => {
				// eslint-disable-next-line no-console
				console.error(error)
				ModalUtil.show(<SimpleDialog ok title="Unkown error saving draft" />)
			})
	}
}

export default PageEditor
