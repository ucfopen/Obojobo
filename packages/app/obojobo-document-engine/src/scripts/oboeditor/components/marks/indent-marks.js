import IndentIcon from '../../assets/indent-icon'
import UnindentIcon from '../../assets/unindent-icon'
import HangingIndentIcon from '../../assets/hanging-indent-icon'

const INDENT = 'indent'
const UNINDENT = 'unindent'
const HANGING_INDENT = 'hanging-indent'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

// These values are also defined in obojobo-chinks-list/list-styles
const unorderedBullets = ['disc', 'circle', 'square']
const orderedBullets = ['decimal', 'upper-alpha', 'upper-roman', 'lower-alpha', 'lower-roman']

const AlignMarks = {
	plugins: {
		queries: {
			indentText(editor, block) {
				const dataJSON = block.data.toJSON()
				dataJSON.indent = Math.min(dataJSON.indent + 1, 20)
				return editor.setNodeByKey(block.key, { data: dataJSON })
			},
			indentCode(editor, block) {
				const dataJSON = block.data.toJSON()
				dataJSON.content.indent = dataJSON.content.indent + 1
				return editor.setNodeByKey(block.key, { data: dataJSON })
			},
			indentList(editor, block) {
				let bullet = 'disc'
				let type = 'unordered'

				// get the bullet and type of the closest parent level
				const level = editor.value.document.getClosest(
					block.key,
					parent => parent.type === LIST_LEVEL_NODE
				)

				const content = level.data.get('content')
				bullet = content.bulletStyle
				type = content.type

				// get the proper bullet for the next level
				const bulletList = type === 'unordered' ? unorderedBullets : orderedBullets
				const nextBullet = bulletList[(bulletList.indexOf(bullet) + 1) % bulletList.length]

				return editor.wrapBlockByKey(block.key, {
					type: LIST_LEVEL_NODE,
					data: { content: { type: type, bulletStyle: nextBullet } }
				})
			},
			unindentText(editor, block) {
				const dataJSON = block.data.toJSON()
				dataJSON.indent = Math.max(dataJSON.indent - 1, 0)
				return editor.setNodeByKey(block.key, { data: dataJSON })
			},
			unindentCode(editor, block) {
				const dataJSON = block.data.toJSON()
				dataJSON.content.indent = Math.max(dataJSON.content.indent - 1, 0)
				return editor.setNodeByKey(block.key, { data: dataJSON })
			},
			unindentList(editor, block) {
				return editor.unwrapNodeByKey(block.key, LIST_LEVEL_NODE)
			}
		}
	},
	marks: [
		{
			name: 'Indent',
			type: INDENT,
			icon: IndentIcon,
			action: editor =>
				editor.value.blocks.forEach(block => {
					switch (block.type) {
						case CODE_LINE_NODE:
							return editor.indentCode(block)
						case LIST_LINE_NODE:
							return editor.indentList(block)
						default:
							return editor.indentText(block)
					}
				})
		},
		{
			name: 'Unindent',
			type: UNINDENT,
			icon: UnindentIcon,
			action: editor =>
				editor.value.blocks.forEach(block => {
					switch (block.type) {
						case CODE_LINE_NODE:
							return editor.unindentCode(block)
						case LIST_LINE_NODE:
							return editor.unindentList(block)
						default:
							return editor.unindentText(block)
					}
				})
		},
		{
			name: 'Hanging Indent',
			type: HANGING_INDENT,
			icon: HangingIndentIcon,
			action: editor =>
				editor.value.blocks.forEach(block => {
					const dataJSON = block.data.toJSON()

					switch (block.type) {
						case TEXT_LINE_NODE:
							dataJSON.hangingIndent = !dataJSON.hangingIndent
							return editor.setNodeByKey(block.key, { data: dataJSON })
						case LIST_LINE_NODE:
							dataJSON.hangingIndent = !dataJSON.hangingIndent
							return editor.setNodeByKey(block.key, { data: dataJSON })
					}
				})
		}
	]
}

export default AlignMarks
