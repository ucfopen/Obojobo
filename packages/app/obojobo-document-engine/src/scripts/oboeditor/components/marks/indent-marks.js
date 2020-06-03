import { Editor, Element, Transforms, Range } from 'slate'
import { ReactEditor } from 'slate-react'

import IndentIcon from '../../assets/indent-icon'
import UnindentIcon from '../../assets/unindent-icon'
import HangingIndentIcon from '../../assets/hanging-indent-icon'
import toggleHangingIndent from 'obojobo-chunks-text/util/toggle-hanging-indent'

const INDENT = 'indent'
const UNINDENT = 'unindent'
const HANGING_INDENT = 'hanging-indent'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

// These values are also defined in obojobo-chinks-list/list-styles
const unorderedBullets = ['disc', 'circle', 'square']
const orderedBullets = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha', 'upper-roman']

const AlignMarks = {
	plugins: {
		commands: {
			indentText(editor, [, path]) {
				const nodeRange = Editor.range(editor, path)
				// Get only the Element children of the current node that are in the current selection
				const list = Array.from(
					Editor.nodes(editor, {
						at: Range.intersection(editor.selection, nodeRange),
						match: child => child.subtype === TEXT_LINE_NODE
					})
				)

				// For each child in the selection, increment the indent without letting it get above 20
				for (const [child, path] of list) {
					Transforms.setNodes(
						editor,
						{ content: { ...child.content, indent: Math.min(child.content.indent + 1, 20) } },
						{ at: path }
					)
				}
			},
			indentCode(editor, [, path]) {
				const nodeRange = Editor.range(editor, path)
				// Get only the Element children of the current node that are in the current selection
				const list = Array.from(
					Editor.nodes(editor, {
						at: Range.intersection(editor.selection, nodeRange),
						match: child => child.subtype === CODE_LINE_NODE
					})
				)

				// For each child in the selection, increment the indent without letting it get above 20
				for (const [child, path] of list) {
					Transforms.setNodes(
						editor,
						{ content: { ...child.content, indent: Math.min(child.content.indent + 1, 20) } },
						{ at: path }
					)
				}
			},
			indentList(editor, [, path]) {
				const nodeRange = Editor.range(editor, path)
				const list = Array.from(
					Editor.nodes(editor, {
						at: Range.intersection(editor.selection, nodeRange),
						mode: 'lowest',
						match: child => child.subtype === LIST_LINE_NODE
					})
				)

				// Normalization will merge consecutive ListLevels into a single node,
				// which can change the paths of subsequent ListLines. To keep the paths consistant,
				// prevent normalization until all Lines have been indented
				Editor.withoutNormalizing(editor, () => {
					for (const [, path] of list) {
						const [parent] = Editor.parent(editor, path)

						const bulletList =
							parent.content.type === 'unordered' ? unorderedBullets : orderedBullets
						const bulletStyle =
							bulletList[(bulletList.indexOf(parent.content.bulletStyle) + 1) % bulletList.length]

						Transforms.wrapNodes(
							editor,
							{
								type: LIST_NODE,
								subtype: LIST_LEVEL_NODE,
								content: { type: parent.content.type, bulletStyle }
							},
							{
								at: path
							}
						)
					}
				})
			},
			unindentText(editor, [, path]) {
				const nodeRange = Editor.range(editor, path)

				// Get only the Element children of the current node that are in the current selection
				const list = Array.from(
					Editor.nodes(editor, {
						at: Range.intersection(editor.selection, nodeRange),
						match: child => child.subtype === TEXT_LINE_NODE
					})
				)

				// For each child in the selection, decrement the indent without letting it drop below 0
				for (const [child, path] of list) {
					Transforms.setNodes(
						editor,
						{ content: { ...child.content, indent: Math.max(child.content.indent - 1, 0) } },
						{ at: path }
					)
				}
			},
			unindentCode(editor, [, path]) {
				const nodeRange = Editor.range(editor, path)

				// Get only the Element children of the current node that are in the current selection
				const list = Array.from(
					Editor.nodes(editor, {
						at: Range.intersection(editor.selection, nodeRange),
						match: child => child.subtype === CODE_LINE_NODE
					})
				)

				// For each child in the selection, decrement the indent without letting it drop below 0
				for (const [child, path] of list) {
					Transforms.setNodes(
						editor,
						{ content: { ...child.content, indent: Math.max(child.content.indent - 1, 0) } },
						{ at: path }
					)
				}
			},
			unindentList(editor, [, path]) {
				const nodeRange = Editor.range(editor, path)

				Transforms.liftNodes(editor, {
					at: Range.intersection(editor.selection, nodeRange),
					mode: 'lowest',
					match: child => child.subtype === LIST_LINE_NODE
				})
			}
		}
	},
	marks: [
		{
			name: 'Indent',
			type: INDENT,
			icon: IndentIcon,
			action: editor => {
				const list = Array.from(
					Editor.nodes(editor, {
						mode: 'lowest',
						match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
					})
				)

				list.forEach(entry => {
					switch (entry[0].type) {
						case CODE_NODE:
							return editor.indentCode(entry)
						case LIST_NODE:
							return editor.indentList(entry)
						case TEXT_NODE:
							return editor.indentText(entry)
					}
				})

				ReactEditor.focus(editor)
			}
		},
		{
			name: 'Unindent',
			type: UNINDENT,
			icon: UnindentIcon,
			action: editor => {
				Editor.withoutNormalizing(editor, () => {
					const list = Array.from(
						Editor.nodes(editor, {
							mode: 'lowest',
							match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
						})
					)

					list.forEach(entry => {
						switch (entry[0].type) {
							case CODE_NODE:
								return editor.unindentCode(entry)
							case LIST_NODE:
								return editor.unindentList(entry)
							case TEXT_NODE:
								return editor.unindentText(entry)
						}
					})
				})

				ReactEditor.focus(editor)
			}
		},
		{
			name: 'Hanging Indent',
			type: HANGING_INDENT,
			icon: HangingIndentIcon,
			action: editor => {
				const list = Array.from(
					Editor.nodes(editor, {
						mode: 'lowest',
						match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
					})
				)

				list.forEach(entry => toggleHangingIndent(entry, editor))
			}
		}
	]
}

export default AlignMarks
