import React from 'react'
import { Editor, Transforms, Range } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'

import Link from './link'
import LinkIcon from '../../assets/link-icon'

const { Prompt, SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

const LINK_MARK = 'a'
const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

const LinkMark = {
	plugins: {
		isInline(element, editor, next) {
			if (element.type === LINK_MARK) return true

			return next(element)
		},
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== 'k') return

			event.preventDefault()
			return ModalUtil.show(
				<Prompt
					title="Insert Link"
					message="Enter the link url:"
					onConfirm={editor.changeLinkValue}
				/>
			)
		},
		renderNode(props) {
			return <Link {...props} {...props.attributes} />
		},
		commands: {
			changeLinkValue(editor, href) {
				ModalUtil.hide()

				Transforms.select(editor, editor.prevSelection)
				Transforms.unwrapNodes(editor, { match: n => n.type === LINK_MARK })

				if (!href || !/[^\s]/.test(href)) return ReactEditor.focus(editor)

				const { selection } = editor
				const isCollapsed = selection && Range.isCollapsed(selection)
				const link = {
					type: LINK_MARK,
					href,
					children: isCollapsed ? [{ text: href }] : []
				}

				Editor.withoutNormalizing(editor, () => {
					if (isCollapsed) {
						Transforms.insertNodes(editor, link)
					} else {
						Transforms.wrapNodes(editor, link, { split: true })
						Transforms.collapse(editor, { edge: 'end' })
					}
				})
			}
		}
	},
	marks: [
		{
			name: 'Link',
			type: LinkMark,
			icon: LinkIcon,
			action: editor => {
				// If we have part of the selection inside a button, prevent links
				const buttonNodes = Array.from(Editor.nodes(editor, { match: n => n.type === BUTTON_NODE }))
				if (buttonNodes.length > 0) {
					return ModalUtil.show(<SimpleDialog ok>Links cannot be added to buttons</SimpleDialog>)
				}

				return ModalUtil.show(
					<Prompt
						title="Insert Link"
						message="Enter the link url:"
						onConfirm={editor.changeLinkValue}
					/>
				)
			}
		}
	]
}

export default LinkMark
