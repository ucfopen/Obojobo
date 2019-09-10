import './page-editor.scss'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import AlignMarks from './marks/align-marks'
import Assessment from 'obojobo-sections-assessment/editor'
import BasicMarks from './marks/basic-marks'
import ClipboardPlugin from '../plugins/clipboard-plugin'
import Common from 'obojobo-document-engine/src/scripts/common'
import Component from './node/editor'
import ContentToolbar from './toolbars/content-toolbar'
import { Editor } from 'slate-react'
import EditorSchema from '../plugins/editor-schema'
import EditorStore from '../stores/editor-store'
import FileToolbar from './toolbars/file-toolbar'
import hotKeyPlugin from '../plugins/hot-key-plugin'
import IndentMarks from './marks/indent-marks'
import LinkMark from './marks/link-mark'
import React from 'react'
import ScriptMarks from './marks/script-marks'
import SelectParameter from './parameter-node/select-parameter'
import TextParameter from './parameter-node/text-parameter'
import ToggleParameter from './parameter-node/toggle-parameter'
import { Value } from 'slate'

const { ModalUtil } = Common.util

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

class PageEditor extends React.Component {
	constructor(props) {
		super(props)
		const json = this.importFromJSON()

		this.state = {
			value: Value.fromJSON(json),
			saved: true
		}

		this.saveModule = this.saveModule.bind(this)
		this.checkIfSaved = this.checkIfSaved.bind(this)
		this.plugins = this.getPlugins()
	}

	getPlugins() {
		const nodePlugins = Common.Registry.getItems(this.convertItemsToArray).map(item => item.plugins).filter(item => item)
		const markPlugins = [
			BasicMarks.plugins,
			LinkMark.plugins,
			ScriptMarks.plugins,
			AlignMarks.plugins,
			IndentMarks.plugins,
		]
		const componentPlugins = [
			Component.plugins,
			ToggleParameter.plugins,
			SelectParameter.plugins,
			TextParameter.plugins,
		]

		const editorPlugins = [
			EditorSchema,
			ClipboardPlugin,
			hotKeyPlugin(() => this.saveModule(this.props.draftId)),
		]

		return [
			...nodePlugins,
			...markPlugins,
			...componentPlugins,
			...editorPlugins
		]
	}

	convertItemsToArray(items) {
		return Array.from(items.values())
	}

	componentDidMount() {
		// Setup unload to prompt user before closing
		window.addEventListener("beforeunload", this.checkIfSaved)
	}

	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.checkIfSaved)
	}

	checkIfSaved(event) {
		if (!this.state.saved) {
			event.returnValue = true
			return true // Returning true will cause browser to ask user to confirm leaving page
		}
		//eslint-disable-next-line
		return undefined // Returning undefined will allow browser to close normally
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
			<div className={'component obojobo-draft--modules--module editor--page-editor'} role="main">
				<div className="draft-toolbars">
					<div className="draft-title">{this.props.model.title}</div>
					<FileToolbar
						getEditor={this.getEditor.bind(this)}
						model={this.props.model}
						draftId={this.props.draftId}
						onSave={this.saveModule}
						switchMode={this.props.switchMode}
						saved={this.state.saved}
						mode={'visual'}
					/>
					<ContentToolbar getEditor={this.getEditor.bind(this)} />
				</div>
				<Editor
					className={'component obojobo-draft--pages--page'}
					value={this.state.value}
					ref={this.ref.bind(this)}
					onChange={change => this.onChange(change)}
					plugins={this.plugins}
				/>
			</div>
		)
	}

	getEditor() {
		return this.editor
	}

	onChange(change) {
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

		this.setState({ value: change.value, saved: false })
	}

	saveModule(draftId) {
		this.exportToJSON(this.props.page, this.state.value)
		const json = this.props.model.flatJSON()
		json.content.start = EditorStore.state.startingId

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
		this.setState({ saved: true })
		return APIUtil.postDraft(draftId, JSON.stringify(json))
	}

	exportToJSON(page, value) {
		if (page.get('type') === ASSESSMENT_NODE) {
			const json = Common.Registry.getItemForType(ASSESSMENT_NODE).slateToObo(
				value.document.nodes.get(0)
			)
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
		const { page } = this.props

		const json = { document: { nodes: [] } }

		if (page.get('type') === ASSESSMENT_NODE) {
			json.document.nodes.push(Assessment.helpers.oboToSlate(page))
		} else {
			page.attributes.children.forEach(child => {
				json.document.nodes.push(Component.helpers.oboToSlate(child))
			})
		}

		return json
	}
}

export default PageEditor
