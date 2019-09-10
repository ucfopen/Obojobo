import React from 'react'
import { Block, Document } from 'slate'
import { getEventTransfer, setEventTransfer } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'

import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

import './editor-component.scss'

//import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

import emptyMod from './empty-mod.json'

const { Button } = Common.components

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

class Mod extends React.Component {
	deleteNode() {
		const editor = this.props.editor

		const parent = editor.value.document.getDescendant(this.props.parent.key)

		const sibling = parent.nodes.get(1)

		// If this is the only row in the list, delete the list
		if (!sibling) {
			return editor.removeNodeByKey(parent.key)
		}

		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		return (
			<div className={'mod pad'}>
				{this.props.children}
				<Button className={'delete-button'} onClick={() => this.deleteNode()}>
					×
				</Button>
			</div>
		)
	}
}

const ModList = props => {
	return (
		<div>
			<p contentEditable={false}>{'Mods:'}</p>
			{props.children}
		</div>
	)
}

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addMod() {
		const editor = this.props.editor

		// If we are adding the first mod, we need to add a ModList
		if (this.props.node.nodes.size < 5) {
			const modlist = Block.create({
				type: MOD_LIST_NODE,
				nodes: [emptyMod]
			})
			return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, modlist)
		}

		const modlist = this.props.node.nodes.get(4)

		const mod = Block.create(emptyMod)
		return editor.insertNodeByKey(modlist.key, modlist.nodes.size, mod)
	}

	deleteNode() {
		const editor = this.props.editor

		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		return (
			<div className={'rubric pad'}>
				<h1 contentEditable={false}>{'Rubric'}</h1>
				<div className={'parameter-node'} contentEditable={false}>
					{'Type: ' + this.state.type}
				</div>
				{this.props.children}
				<Button className={'add-button'} onClick={() => this.addMod()}>
					{'Add Mod'}
				</Button>
				<Button className={'delete-button'} onClick={() => this.deleteNode()}>
					×
				</Button>
			</div>
		)
	}
}

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
				return <Node {...props} {...props.attributes} />
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
						type: 'oboeditor.component',
						nodes: [
							{
								object: 'block',
								type: 'ObojoboDraft.Chunks.Text',
								data: { hangingIndent: false },
								nodes: [
									{
										object: 'block',
										type: 'ObojoboDraft.Chunks.Text.TextLine',
										data: { indent: 0 , hangingIndent: false},
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
					}
				]
			})
		}
	}
}

const Rubric = {
	components: {
		Node,
		ModList,
		Mod
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default Rubric
