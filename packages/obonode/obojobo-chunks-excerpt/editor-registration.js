import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import React from 'react'
import { Editor, Element, Node, Text, Transforms } from 'slate'
import decreaseIndent from './changes/decrease-indent'
import increaseIndent from './changes/increase-indent'
import indentOrTab from './changes/indent-or-tab'
import ExcerptContent from './components/excerpt-content/editor-component'
import Converter from './converter'
import EditorComponent from './editor-component'
import emptyNode from './empty-node.json'
import Icon from './icon'

const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'
const EXCERPT_CONTENT = 'ObojoboDraft.Chunks.Excerpt.ExcerptContent'
const CITE_TEXT_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationText'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const disallowedChildren = [
	'ObojoboDraft.Chunks.Question',
	'ObojoboDraft.Chunks.QuestionBank',
	EXCERPT_NODE
]

const Excerpt = {
	name: EXCERPT_NODE,
	icon: Icon,
	menuLabel: 'Excerpt',
	isInsertable: true,
	isContent: true,
	disallowedChildren: disallowedChildren,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// this probably isn't possible since excerpts should always have at least one empty text node
		// this should transform any text thrown into an excerpt directly just in case
		insertData(data, editor, next) {
			// Insert Slate fragments normally
			if (data.types.includes('application/x-slate-fragment')) return next(data)

			// If the node that we will be inserting into is not a Excerpt node use the regular logic
			const [first] = Editor.nodes(editor, { match: node => Element.isElement(node) })
			if (first[0].type !== TEXT_NODE) return next(data)

			// When inserting plain text into an Excerpt node, transform the text into a Text node
			const plainText = data.getData('text/plain')
			const fragment = plainText.split('\n').map(text => ({
				type: TEXT_NODE,
				subtype: TEXT_LINE_NODE,
				content: { indent: 0, hangingIndent: false },
				children: [{ text }]
			}))

			Transforms.insertFragment(editor, fragment)
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		decorate([node, path], editor) {
			// Define a placeholder decoration
			const placeholders = []

			if (
				node.type === EXCERPT_NODE &&
				node.subtype === CITE_TEXT_NODE &&
				Node.string(node) === ''
			) {
				const point = Editor.start(editor, path)

				placeholders.push({
					placeholder: 'Type your optional citation here',
					anchor: point,
					focus: point
				})
			}

			return placeholders
		},
		onKeyDown(entry, editor, event) {
			switch (event.key) {
				// revisit later to potentially move any existing
				//  citation text into the last Text node in the excerpt content
				case 'Backspace':
					if (!editor.selection.focus.offset) {
						event.preventDefault()
					}
					break

				case 'Delete':
					if (editor.selection.anchor.offset === entry[0].children[1].children[0].text.length) {
						event.preventDefault()
						return
					}

					return KeyDownUtil.deleteEmptyParent(event, editor, entry, event.key === 'Delete')

				case 'Tab':
					// TAB+SHIFT
					if (event.shiftKey) return decreaseIndent(entry, editor, event)

					// TAB+ALT
					if (event.altKey) return increaseIndent(entry, editor, event)

					// TAB
					return indentOrTab(entry, editor, event)

				// preventing anything from happening here for now
				// TODO: adjust the logic here to create new text nodes
				//  outside of the Excerpt node rather than inside it
				case 'Enter':
					return event.preventDefault()
				// return KeyDownUtil.breakToText(event, editor, entry)
			}
		},
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// EXCERPT_CONTENT shouldn't have any loose text nodes:
			if (
				Element.isElement(node) &&
				node.type === EXCERPT_NODE &&
				node.subtype === EXCERPT_CONTENT
			) {
				// Wrap any loose children into TextLines (Text normalization should then turn them
				// into complete Text chunks)
				for (const [child, childPath] of Node.children(editor, path)) {
					if (Text.isText(child)) {
						return Transforms.wrapNodes(
							editor,
							{
								type: TEXT_NODE,
								subtype: TEXT_LINE_NODE,
								content: { indent: 0 }
							},
							{ at: childPath }
						)
					}
				}
			}

			// CITE_TEXT_NODE must contain only text
			if (
				Element.isElement(node) &&
				node.type === EXCERPT_NODE &&
				node.subtype === CITE_TEXT_NODE
			) {
				// this is kind of inelegant but should hopefully do the job
				for (const [child] of Node.children(editor, path)) {
					if (!Text.isText(child)) {
						Transforms.removeNodes(editor, { at: child })
					}
				}
			}

			// There must be one and only one EXCERPT_CONTENT and CITE_TEXT_NODE, in that order,
			// and no other types of children
			if (Element.isElement(node) && node.type === EXCERPT_NODE && !node.subtype) {
				const nodesToRemove = []
				let contentNode = null
				let citeTextNode = null

				for (const [child, childPath] of Node.children(editor, path)) {
					switch (child.subtype) {
						case EXCERPT_CONTENT:
							if (!contentNode) {
								contentNode = child
							} else {
								nodesToRemove.push(childPath)
							}
							break

						case CITE_TEXT_NODE:
							if (!citeTextNode && contentNode) {
								citeTextNode = child
							} else {
								nodesToRemove.push(childPath)
							}
							break

						default:
							nodesToRemove.push(childPath)
							break
					}
				}

				if (nodesToRemove.length > 0) {
					// Remove Node
					for (const node of nodesToRemove) {
						Transforms.removeNodes(editor, { at: node })
					}
				}

				if (!contentNode) {
					// Add in content nodes
					const a = { ...emptyNode.children[0] }
					Transforms.insertNodes(editor, a, { at: path.concat(0) })
					return
				}

				if (!citeTextNode) {
					const b = { ...emptyNode.children[1] }
					Transforms.insertNodes(editor, b, { at: path.concat(1) })
					return
				}
			}

			next(entry, editor)
		},
		renderNode(props) {
			switch (props.element.subtype) {
				case CITE_TEXT_NODE:
					return <cite {...props} {...props.attributes} />

				case EXCERPT_CONTENT:
					return <ExcerptContent {...props} {...props.attributes} />

				default:
					return <EditorComponent {...props} {...props.attributes} />
			}
		}
	}
}

export default Excerpt
