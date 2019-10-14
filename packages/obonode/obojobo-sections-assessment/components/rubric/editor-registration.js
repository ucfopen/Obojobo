import React from 'react'
import { Document } from 'slate'
import { getEventTransfer, setEventTransfer } from 'slate-react'

import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

import RubricComponent from './editor-component'
import Mod from './mod'
import ModList from './mod-list'
import Schema from './schema'
import Converter from './converter'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

const isType = editor =>
	editor.value.blocks.some(
		block => !!editor.value.document.getClosest(block.key, parent => parent.type === RUBRIC_NODE)
	)

const plugins = {
	onPaste(event, editor, next) {
		// See if any of the selected nodes have a Rubric parent
		const isRubric = isType(editor)
		if (!isRubric) return next()

		// When pasting into a rubric, paste everything as plain text
		const transfer = getEventTransfer(event)
		return editor.insertText(transfer.text)
	},
	onCut(event, editor, next) {
		// See if any of the selected nodes have a Rubric parent
		const isRubric = isType(editor)
		if (!isRubric) return next()

		// Cut out just the text, and then delete the text but not the parameter nodes
		const textFragment = editor.extractTextToFragment()
		KeyDownUtil.deleteNodeContents(event, editor, next)

		return setEventTransfer(event, 'fragment', textFragment)
	},
	onCopy(event, editor, next) {
		// See if any of the selected nodes have a Rubric parent
		const isRubric = isType(editor)
		if (!isRubric) return next()

		// Copy just the text
		const textFragment = editor.extractTextToFragment()

		return setEventTransfer(event, 'fragment', textFragment)
	},
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case MOD_NODE:
				return <Mod {...props} {...props.attributes} />
			case MOD_LIST_NODE:
				return <ModList {...props} {...props.attributes} />
			case RUBRIC_NODE:
				return <RubricComponent {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema,
	queries: {
		extractTextToFragment(editor) {
			const cutText = editor.value.fragment.text

			return Document.create({
				object: 'document',
				nodes: [
					{
						object: 'block',
						type: 'ObojoboDraft.Chunks.Text',
						nodes: [
							{
								object: 'block',
								type: 'ObojoboDraft.Chunks.Text.TextLine',
								data: { indent: 0 },
								nodes: [
									{
										object: 'text',
										leaves: [{ object: 'leaf', text: cutText, marks: [] }]
									}
								]
							}
						]
					}
				]
			})
		}
	}
}

const Rubric = {
	helpers: Converter,
	plugins
}

export default Rubric
