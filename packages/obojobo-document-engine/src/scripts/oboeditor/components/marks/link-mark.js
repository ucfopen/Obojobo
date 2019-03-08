import React from 'react'
import Common from 'Common'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

const LINK_MARK = 'a'

const changeLinkValue = (editor, href) => {
	ModalUtil.hide()

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

const toggleLink = editor => {
	ModalUtil.show(
		<Prompt
			title="Insert Link"
			message="Enter the link url:"
			onConfirm={changeLinkValue.bind(this, editor)}
		/>
	)
}

function linkMark(options) {
	const { type, render } = options

	return {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey) || event.key !== 'k') return next()

			event.preventDefault()
			return toggleLink(editor)
		},
		renderMark(props, editor, next) {
			switch (props.mark.type) {
				case type:
					return render(props)
				default:
					return next()
			}
		},
		helpers: {
			toggleLink,
			changeLinkValue
		}
	}
}

export default linkMark
