import './page-editor.scss'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import AlignMarks from './marks/align-marks'
import BasicMarks from './marks/basic-marks'
import ClipboardPlugin from '../plugins/clipboard-plugin'
import Common from 'obojobo-document-engine/src/scripts/common'
import Component from './node/editor'
import ContentToolbar from './toolbars/content-toolbar'
import EditorStore from '../stores/editor-store'
import FileToolbar from './toolbars/file-toolbar'
import FormatPlugin from '../plugins/format-plugin'
import IndentMarks from './marks/indent-marks'
import LinkMark from './marks/link-mark'
import OboNodePlugin from '../plugins/obonode-plugin'
import ScriptMarks from './marks/script-marks'
import EditorNav from './navigation/editor-nav'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import PageEditorErrorBoundry from './page-editor-error-boundry'

const { OboModel } = Common.models

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

import React from 'react'
import { createEditor, Editor, Element, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'

// This file overwrites some Slate methods to fix weird bugs in the Slate system
// It should be deleted when the Slate bugs are remedied
import '../overwrite-bug-fixes'

class PageEditor extends React.Component {
	constructor(props) {
		super(props)
		this.assessment = Common.Registry.getItemForType(ASSESSMENT_NODE)

		const json = this.importFromJSON()

		this.state = {
			value: json,
			saved: true,
			editable: json && json.length >= 1 && !json[0].text,
			showPlaceholders: true
		}

		this.editorRef = React.createRef()
		this.onChange = this.onChange.bind(this)
		this.exportToJSON = this.exportToJSON.bind(this)
		this.saveModule = this.saveModule.bind(this)
		this.checkIfSaved = this.checkIfSaved.bind(this)
		this.toggleEditable = this.toggleEditable.bind(this)
		this.exportCurrentToJSON = this.exportCurrentToJSON.bind(this)
		this.markUnsaved = this.markUnsaved.bind(this)
		this.insertableItems = []
		this.onKeyDown = this.onKeyDown.bind(this)
		this.decorate = this.decorate.bind(this)
		this.renderLeaf = this.renderLeaf.bind(this)

		this.editor = this.withPlugins(withHistory(withReact(createEditor())))
		this.editor.toggleEditable = this.toggleEditable
		this.editor.markUnsaved = this.markUnsaved
	}

	toggleEditable(editable) {
		return this.setState({ editable })
	}

	markUnsaved() {
		return this.setState({ saved: false })
	}

	// All plugins are passed the following parameters:
	// Any parameters that the default method is passed
	// The editor
	// The default method
	addPlugin(editor, plugin) {
		const { normalizeNode, isVoid, insertData, apply } = editor
		if (plugin.normalizeNode) {
			editor.normalizeNode = entry => plugin.normalizeNode(entry, editor, normalizeNode)
		}

		if (plugin.isVoid) {
			editor.isVoid = element => plugin.isVoid(element, editor, isVoid)
		}

		if (plugin.isInline) {
			editor.isInline = element => plugin.isInline(element, editor, isVoid)
		}

		if (plugin.insertData) {
			editor.insertData = data => plugin.insertData(data, editor, insertData)
		}

		if (plugin.commands) {
			for (const [name, funct] of Object.entries(plugin.commands)) {
				editor[name] = funct.bind(this, editor)
			}
		}

		if (plugin.apply) {
			editor.apply = op => plugin.apply(op, editor, apply)
		}

		return editor
	}

	withPlugins(editor) {
		const nodePlugins = Common.Registry.getItems(this.convertItemsToArray)
			.map(item => item.plugins)
			.filter(item => item)

		const markPlugins = [
			BasicMarks.plugins,
			LinkMark.plugins,
			ScriptMarks.plugins,
			AlignMarks.plugins,
			IndentMarks.plugins
		]

		this.globalPlugins = [...markPlugins, ClipboardPlugin, FormatPlugin, OboNodePlugin]

		// Plugins are listed in order of priority
		// The plugins list is reversed after building because the editor functions
		// are built from the bottom up to the top
		this.plugins = [...nodePlugins, ...this.globalPlugins].reverse()

		this.renderLeafPlugins = this.plugins.filter(plugins => plugins.renderLeaf)

		return this.plugins.reduce(this.addPlugin, editor)
	}

	convertItemsToArray(items) {
		return Array.from(items.values())
	}

	componentDidMount() {
		// Setup unload to prompt user before closing
		window.addEventListener('beforeunload', this.checkIfSaved)
		// Set keyboard focus to the editor
		Transforms.select(this.editor, Editor.start(this.editor, []))
		ReactEditor.focus(this.editor)
	}

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.checkIfSaved)
	}

	checkIfSaved(event) {
		if (this.props.readOnly) {
			//eslint-disable-next-line
			return undefined // Returning undefined will allow browser to close normally
		}
		if (!this.state.saved) {
			event.returnValue = true
			return true // Returning true will cause browser to ask user to confirm leaving page
		}
		//eslint-disable-next-line
		return undefined
	}

	onKeyDownGlobal(event) {
		if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault()
			this.saveModule(this.props.draftId)
		}

		if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault()
			this.editor.undo()
		}

		if (event.key === 'y' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault()
			this.editor.redo()
		}
	}

	onChange(value) {
		// Save the previous selection in case the editor is unfocused
		// This mostly happens with MoreInfoBoxes and void nodes
		if (this.editor.selection) this.editor.prevSelection = this.editor.selection

		this.setState({ value, saved: false })
	}

	// Methods that handle movement between pages

	componentDidUpdate(prevProps, prevState) {
		// Do nothing when updating state from empty page
		if (!prevProps.page && !this.props.page) {
			return
		}

		// If updating from an existing page to no page, set the user alert message
		if (prevProps.page && !this.props.page) {
			return this.setState({
				value: [{ text: 'No content available, create a page to start editing' }],
				editable: false
			})
		}

		// If updating from no page to an existing page, load the new page into the editor
		if (!prevProps.page && this.props.page) {
			this.editor.selection = null
			this.editor.prevSelection = null
			return this.setState({ value: this.importFromJSON(), editable: true })
		}

		// Both page and previous page are garunteed to not be null here
		// Save changes and update value when switching pages
		if (prevProps.page.id !== this.props.page.id) {
			this.editor.selection = null
			this.editor.prevSelection = null
			this.exportToJSON(prevProps.page, prevState.value)
			return this.setState({ value: this.importFromJSON(), editable: true })
		}
	}

	saveModule(draftId) {
		if (this.props.readOnly) {
			return
		}

		this.exportCurrentToJSON()
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
		if (page === null) return

		if (page.get('type') === ASSESSMENT_NODE) {
			const json = this.assessment.slateToObo(value[0])
			page.set('children', json.children)
			const childrenModels = json.children.map(newChild => OboModel.create(newChild))
			page.children.reset(childrenModels)
			page.set('content', json.content)
			return json
		} else {
			// Build page wrapper
			const json = {}
			json.children = []

			value.forEach(child => {
				const oboChild = Component.helpers.slateToObo(child)
				json.children.push(oboChild)
			})

			page.set('children', json.children)
			const childrenModels = json.children.map(newChild => OboModel.create(newChild))
			page.children.reset(childrenModels)

			return json
		}
	}

	// convenience method to prevent rerendring nav and duplicate code
	exportCurrentToJSON() {
		this.exportToJSON(this.props.page, this.state.value)
	}

	importFromJSON() {
		if (!this.props.page) {
			// if page is empty, exit
			return [{ text: 'No content available, create a page to start editing' }]
		}

		const json = this.props.page.toJSON()

		if (json.type === ASSESSMENT_NODE) {
			return [this.assessment.oboToSlate(this.props.page)]
		} else {
			const children = json.children.map(child => Component.helpers.oboToSlate(child))
			return children
		}
	}

	// All the 'plugin' methods that allow the obonodes to extend the default functionality

	onKeyDown(event) {
		// Run the global keydowns, stopping if one executes
		this.onKeyDownGlobal(event)

		for (const plugin of this.globalPlugins) {
			if (plugin.onKeyDown) plugin.onKeyDown(event, this.editor)
			if (event.defaultPrevented) return
		}

		// If none of the global plugins caught the key event,
		// Get each component (non-subtype) node that is selected,
		// and run keydown on each
		// The event will always run on every selected node, but
		// if one node does something special, it will prevent the
		// default Slate action from occurring on any selected node
		const list = Array.from(
			Editor.nodes(this.editor, {
				mode: 'lowest',
				match: node => Element.isElement(node) && !this.editor.isInline(node) && !node.subtype
			})
		)

		for (const entry of list) {
			const item = Common.Registry.getItemForType(entry[0].type)
			if (item && item.plugins.onKeyDown) {
				item.plugins.onKeyDown(entry, this.editor, event)
			}
		}
	}

	// Generates any necessary decorations, such as place holders
	decorate(entry) {
		const item = Common.Registry.getItemForType(entry[0].type)
		if (item && item.plugins.decorate) {
			return item.plugins.decorate(entry, this.editor)
		}

		return []
	}

	// All the render methods that allow the editor to display properly

	renderLeaf(props) {
		props = this.renderLeafPlugins.reduce((props, plugin) => plugin.renderLeaf(props), props)
		const { attributes, children, leaf } = props

		if (leaf.placeholder) {
			return (
				<span {...props} {...attributes}>
					<span contentEditable={false} data-placeholder={leaf.placeholder} />
					{children}
				</span>
			)
		}

		return <span {...attributes}>{children}</span>
	}

	renderElement(props) {
		if (props.element.type === 'a') return LinkMark.plugins.renderNode(props)

		const item = Common.Registry.getItemForType(props.element.type)
		if (item) {
			return item.plugins.renderNode(props)
		}
	}

	render() {
		const className =
			'editor--page-editor ' + isOrNot(this.state.showPlaceholders, 'show-placeholders')
		return (
			<div className={className}>
				<Slate editor={this.editor} value={this.state.value} onChange={this.onChange.bind(this)}>
					<div className="draft-toolbars">
						<div className="draft-title">{this.props.model.title}</div>
						<FileToolbar
							editor={this.editor}
							selection={this.editor.selection}
							model={this.props.model}
							draftId={this.props.draftId}
							onSave={this.saveModule}
							switchMode={this.props.switchMode}
							saved={this.state.saved}
							mode={'visual'}
							insertableItems={this.props.insertableItems}
							togglePlaceholders={this.togglePlaceholders}
							showPlaceholders={this.state.showPlaceholders}
							value={this.state.value}
						/>
						<ContentToolbar editor={this.editor} value={this.state.value} />
					</div>

					<EditorNav
						navState={this.props.navState}
						model={this.props.model}
						draftId={this.props.draftId}
						savePage={this.exportCurrentToJSON}
						markUnsaved={this.markUnsaved}
					/>

					<div className="component obojobo-draft--modules--module" role="main">
						<PageEditorErrorBoundry editorRef={this.editorRef}>
							<Editable
								className="obojobo-draft--pages--page"
								renderElement={this.renderElement.bind(this)}
								renderLeaf={this.renderLeaf}
								decorate={this.decorate}
								readOnly={!this.state.editable}
								onKeyDown={this.onKeyDown}
								onCut={this.onCut}
							/>
						</PageEditorErrorBoundry>
					</div>
				</Slate>
			</div>
		)
	}
}

export default PageEditor
