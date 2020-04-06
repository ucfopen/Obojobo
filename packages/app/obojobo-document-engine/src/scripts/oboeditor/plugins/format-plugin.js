import { Editor, Element } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const FormatPlugin = {
	onKeyDown(event, editor, next) {
		if (!(event.ctrlKey || event.metaKey) || !event.shiftKey) return

		switch (event.key) {
			case 'k':
				event.preventDefault()
				return editor.toggleBullet('unordered', 'disc')
			case 'l':
				event.preventDefault()
				return editor.toggleBullet('ordered', 'decimal')
		}
	},
	commands: {
		changeToType: (editor, type, data) => {
			const list = Array.from(Editor.nodes(editor, {
				mode: 'lowest',
				match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
			}))

			Editor.withoutNormalizing(editor, () => {
				list.forEach(entry => {
					const item = Common.Registry.getItemForType(entry[0].type)

					if (item.switchType[type]) {
						item.switchType[type](editor, entry, data)
					}
				})
			})
		},
		toggleBullet(editor, type, bulletStyle) {
			const nodes = Array.from(Editor.nodes(editor, {
				mode: 'lowest',
				match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
			}))
			const isList = nodes.every(([block]) => block.type === LIST_NODE)

			if(!isList) {
				return editor.changeToType(LIST_NODE, { type, bulletStyle })
			}

			const isSameType = nodes.every(([block]) => block.content.listStyles.type === type)
			if(!isSameType) {
				return editor.changeToType(LIST_NODE, { type, bulletStyle })
			}

			editor.changeToType(TEXT_NODE)
		}
	}
}

export default FormatPlugin
