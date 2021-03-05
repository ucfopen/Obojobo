import { Editor, Node, Element, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Converter from './converter'
import Icon from './icon'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import Line from './components/line/editor-component'
import ExcerptContent from './components/excerpt-content/editor-component'
import Text from './components/text/editor-component'
import Citation from './components/citation/editor-component'
import EditorComponent from './editor-component'
import React from 'react'

import normalizeNode from './changes/normalize-node'
import decreaseIndent from './changes/decrease-indent'
import emptyNode from './empty-node.json'
import increaseIndent from './changes/increase-indent'
import indentOrTab from './changes/indent-or-tab'

const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'
const EXCERPT_CONTENT = 'ObojoboDraft.Chunks.Excerpt.ExcerptContent'
const CITE_TEXT_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationText'
const CITE_LINE_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationLine'

// {
/* <Excerpt>
	<ExcerptBody>

	</ExcerptBody>
	<ExcerptCitation>

	</ExcerptCitation>
</Excerpt>

{
	type: "Excerpt",
	content: {
		body: [ {} ],
		citation: [ {} ]
	}
} */
// }

const Excerpt = {
	name: EXCERPT_NODE,
	icon: Icon,
	menuLabel: 'Box / Excerpt',
	isInsertable: true,
	isContent: true,
	helpers: Converter,
	json: {
		emptyNode
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		// insertData(data, editor, next) {
		// 	// Insert Slate fragments normally
		// 	if (data.types.includes('application/x-slate-fragment')) return next(data)

		// 	// If the node that we will be inserting into is not a Excerpt node use the regular logic
		// 	const [first] = Editor.nodes(editor, { match: node => Element.isElement(node) })
		// 	if (first[0].type !== EXCERPT_NODE) return next(data)

		// 	// When inserting plain text into a Excerpt node insert all lines as excerpt
		// 	const plainText = data.getData('text/plain')
		// 	const fragment = plainText.split('\n').map(text => ({
		// 		type: EXCERPT_NODE,
		// 		subtype: EXCERPT_TEXT_LINE_NODE,
		// 		content: { indent: 0, hangingIndent: false },
		// 		children: [{ text }]
		// 	}))

		// 	Transforms.insertFragment(editor, fragment)
		// },
		// normalizeNode,
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		// decorate([node, path], editor) {
		// 	// Define a placeholder decoration

		// 	const placeholders = []

		// 	if (
		// 		Element.isElement(node) &&
		// 		node.subtype === EXCERPT_TEXT_LINE_NODE &&
		// 		Node.string(node) === '' &&
		// 		path[path.length - 1] === 0
		// 	) {
		// 		const point = Editor.start(editor, path)

		// 		placeholders.push({
		// 			placeholder: 'Type your excerpt here',
		// 			anchor: point,
		// 			focus: point
		// 		})
		// 	}

		// 	if (
		// 		Element.isElement(node) &&
		// 		node.subtype === CITE_LINE_NODE &&
		// 		Node.string(node) === '' &&
		// 		path[path.length - 1] === 0
		// 	) {
		// 		const point = Editor.start(editor, path)

		// 		placeholders.push({
		// 			placeholder: 'Type your optional citation here',
		// 			anchor: point,
		// 			focus: point
		// 		})
		// 	}

		// 	return placeholders
		// },
		decorate([node, path], editor) {
			if (Element.isElement(node) && Node.string(node) === '' && node.subtype === CITE_TEXT_NODE) {
				const point = Editor.start(editor, path)

				return [
					{
						placeholder: 'Type a caption or citation here',
						anchor: point,
						focus: point
					}
				]
			}

			return []
		},
		onKeyDown(entry, editor, event) {
			switch (event.key) {
				case 'Backspace':
				case 'Delete':
					return KeyDownUtil.deleteEmptyParent(event, editor, entry, event.key === 'Delete')

				case 'Tab':
					// TAB+SHIFT
					if (event.shiftKey) return decreaseIndent(entry, editor, event)

					// TAB+ALT
					if (event.altKey) return increaseIndent(entry, editor, event)

					// TAB
					return indentOrTab(entry, editor, event)
			}
		},
		// renderNode(props) {
		// 	switch (props.element.subtype) {
		// 		case EXCERPT_TEXT_LINE_NODE:
		// 		case CITE_LINE_NODE:
		// 			return <Line {...props} {...props.attributes} />

		// 		case EXCERPT_TEXT_NODE:
		// 			return <Text {...props} {...props.attributes} />

		// 		case CITE_TEXT_NODE:
		// 			return <Citation {...props} {...props.attributes} />

		// 		default:
		// 			return <EditorComponent {...props} {...props.attributes} />
		// 	}
		// }
		// renderNode(props) {
		// 	console.log('render node', props, props.element.type, props.element.subtype)
		// 	// if(props.element.type === EXCERPT_NODE && !props.element.subtype)
		// 	switch (props.element.subtype) {
		// 		// case SOLUTION_NODE:
		// 		// 	return <Solution {...props} {...props.attributes} />
		// 		default:
		// 			return <EditorComponent {...props} {...props.attributes} />
		// 	}
		// }
		normalizeNode([node, path], editor, next) {
			console.log(
				'nn',
				node,
				path,
				Element.isElement(node),
				node.type === EXCERPT_NODE,
				!node.subtype
			)
			if (
				Element.isElement(node) &&
				node.type === EXCERPT_NODE &&
				node.subtype === EXCERPT_CONTENT
			) {
				console.log('EMPTY?', node.children)
				if (node.children.length === 0) {
					console.log('EMPTY SON', path)
					Transforms.insertNodes(
						editor,
						{
							type: 'ObojoboDraft.Chunks.Text',
							content: {},
							children: [
								{
									type: 'ObojoboDraft.Chunks.Text',
									subtype: 'ObojoboDraft.Chunks.Text.TextLine',
									content: { indent: 0 },
									children: [{ text: '' }]
								}
							]
						},
						{ at: path.concat(0) }
					)
				}
			}
		},
		renderNode(props) {
			switch (props.element.subtype) {
				case CITE_LINE_NODE:
					return <Line {...props} {...props.attributes} />

				case CITE_TEXT_NODE:
					return <Citation {...props} {...props.attributes} />

				case EXCERPT_CONTENT:
					return <ExcerptContent {...props} {...props.attributes} />

				default:
					return <EditorComponent {...props} {...props.attributes} />
			}
		}
	}
}

/*const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'
const EXCERPT_TEXT_NODE = 'ObojoboDraft.Chunks.Excerpt.ExcerptText'
const EXCERPT_TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Excerpt.ExcerptLine'
const CITE_TEXT_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationText'
const CITE_LINE_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationLine' */

export default Excerpt
