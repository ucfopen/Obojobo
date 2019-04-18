import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import Link from './link'
import LinkIcon from '../../assets/link-icon'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

const LINK_MARK = 'a'

const LinkMark = {
	plugins: {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== 'k') return next()

			event.preventDefault()
			return ModalUtil.show(
				<Prompt
					title="Insert Link"
					message="Enter the link url:"
					onConfirm={editor.changeLinkValue}
				/>
			)
		},
		renderMark(props, editor, next) {
			switch (props.mark.type) {
				case 'a':
					return (
						<Link
							mark={props.mark}
							node={props.node}
							offset={props.offset}
							editor={props.editor}
							text={props.text}>
							{props.children}
						</Link>
					)
				default:
					return next()
			}
		},
		queries: {
			changeLinkValue(editor, href) {
				editor.value.marks.forEach(mark => {
					if (mark.type === LINK_MARK) {
						editor.removeMark({
							type: LINK_MARK,
							data: mark.data.toJSON()
						})
					}
				})

				// If href is empty, don't add a link
				if (!href || !/[^\s]/.test(href)) return true

				return editor.addMark({
					type: LINK_MARK,
					data: { href }
				})
			}
		}
	},
	marks: [
		{
			name: 'Link',
			type: LinkMark,
			icon: LinkIcon,
			action: editor => ModalUtil.show(
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
