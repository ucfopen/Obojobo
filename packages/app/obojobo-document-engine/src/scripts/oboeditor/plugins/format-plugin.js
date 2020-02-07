import { Editor, Element } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

const FormatPlugin = {
	commands: {
		changeToType: (editor, type, data) => {
			const list = Array.from(Editor.nodes(editor, {
				mode: 'lowest',
				match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
			}))
			list.forEach(entry => {
				const item = Common.Registry.getItemForType(entry[0].type)

				if (item.switchType[type]) {
					item.switchType[type](editor, entry, data)
				}
			})
		}
	}
}

export default FormatPlugin
