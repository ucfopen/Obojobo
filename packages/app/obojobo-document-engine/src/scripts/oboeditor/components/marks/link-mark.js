import React from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'

import Link from './link'
import LinkIcon from '../../assets/link-icon'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

const LINK_MARK = 'a'

const LinkMark = {
	plugins: {
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
		renderLeaf(props) {
			let { children } = props
			const { leaf } = props

			if (leaf[LINK_MARK]){
				children = (
					<Link
						leaf={leaf}>
						{children}
					</Link>
				)
			}

			props.children = children
			return props
		},
		commands: {
			changeLinkValue(editor, href) {
				ModalUtil.hide()
				Transforms.select(editor, editor.prevSelection)
				Editor.removeMark(editor, LINK_MARK)

				// If href is empty, don't add a link
				if (!href || !/[^\s]/.test(href)) return ReactEditor.focus(editor)

				Editor.addMark(editor, LINK_MARK, true)
				Editor.addMark(editor, 'href', href)
				ReactEditor.focus(editor)
			}
		}
	},
	marks: [
		{
			name: 'Link',
			type: LinkMark,
			icon: LinkIcon,
			action: editor =>
				ModalUtil.show(
					<Prompt
						title="Insert Link"
						message="Enter the link url:"
						onConfirm={editor.changeLinkValue}
					/>
				)
		}
	]
}

export default LinkMark
