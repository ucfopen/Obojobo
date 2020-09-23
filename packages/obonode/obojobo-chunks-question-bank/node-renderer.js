import AlignMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/align-marks'
import BasicMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/basic-marks'
import ClipboardPlugin from 'obojobo-document-engine/src/scripts/oboeditor/plugins/clipboard-plugin'
import Common from 'obojobo-document-engine/src/scripts/common'
import FormatPlugin from 'obojobo-document-engine/src/scripts/oboeditor/plugins/format-plugin'
import IndentMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/indent-marks'
import LinkMark from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/link-mark'
import OboNodePlugin from 'obojobo-document-engine/src/scripts/oboeditor/plugins/obonode-plugin'
import ScriptMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/script-marks'

import React from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

class NodeRenderer extends React.Component {
	constructor(props) {
		super(props)

		this.renderLeaf = this.renderLeaf.bind(this)
		this.renderElement = this.renderElement.bind(this)

		this.editor = this.withPlugins(withReact(createEditor()))
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
		return (
			<Slate editor={this.editor} value={this.props.value}>
				<Editable renderElement={this.renderElement} renderLeaf={this.renderLeaf} readOnly={true} />
			</Slate>
		)
	}
}

export default NodeRenderer
