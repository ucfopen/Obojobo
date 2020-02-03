import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

const ClipboardUtil = {
	copyToClipboard(str) {
		// Loads the url into an invisible textarea
		// to copy it to the clipboard
		const el = document.createElement('textarea')
		el.value = str
		el.setAttribute('readonly', '')
		el.style.position = 'absolute'
		el.style.left = '-9999px'
		document.body.appendChild(el)
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)

		ModalUtil.show(<SimpleDialog ok>{'Copied ' + str + ' to the clipboard'}</SimpleDialog>)
	},
	/**
	 * Slate doesn't currently expose their setFragmentData method, but we need it to override onCut
	 */
	// setFragmentData(dataTransfer, editor)  {
	// 	const { selection } = editor

	// 	if (!selection) {
	// 		return
	// 	}

	// 	const [start, end] = Range.edges(selection)
	// 	const startVoid = Editor.void(editor, { at: start.path })
	// 	const endVoid = Editor.void(editor, { at: end.path })

	// 	if (Range.isCollapsed(selection) && !startVoid) {
	// 		return
	// 	}

	// 	// Create a fake selection so that we can add a Base64-encoded copy of the
	// 	// fragment to the HTML, to decode on future pastes.
	// 	const domRange = ReactEditor.toDOMRange(editor, selection)
	// 	let contents = domRange.cloneContents()
	// 	let attach = contents.childNodes[0] 

	// 	// Make sure attach is non-empty, since empty nodes will not get copied.
	// 	contents.childNodes.forEach(node => {
	// 		if (node.textContent && node.textContent.trim() !== '') {
	// 			attach = node 
	// 		}
	// 	})

	// 	// COMPAT: If the end node is a void node, we need to move the end of the
	// 	// range from the void node's spacer span, to the end of the void node's
	// 	// content, since the spacer is before void's content in the DOM.
	// 	if (endVoid) {
	// 		const [voidNode] = endVoid
	// 		const r = domRange.cloneRange()
	// 		const domNode = ReactEditor.toDOMNode(editor, voidNode)
	// 		r.setEndAfter(domNode)
	// 		contents = r.cloneContents()
	// 	}

	// 	// COMPAT: If the start node is a void node, we need to attach the encoded
	// 	// fragment to the void node's content node instead of the spacer, because
	// 	// attaching it to empty `<div>/<span>` nodes will end up having it erased by
	// 	// most browsers. (2018/04/27)
	// 	if (startVoid) {
	// 		attach = contents.querySelector('[data-slate-spacer]')
	// 	}

	// 	// Remove any zero-width space spans from the cloned DOM so that they don't
	// 	// show up elsewhere when pasted.
	// 	Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(
	// 		zw => {
	// 			const isNewline = zw.getAttribute('data-slate-zero-width') === 'n'
	// 			zw.textContent = isNewline ? '\n' : ''
	// 		}
	// 	)

	// 	// Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
	// 	// in the HTML, and can be used for intra-Slate pasting. If it's a text
	// 	// node, wrap it in a `<span>` so we have something to set an attribute on.
	// 	if (isDOMText(attach)) {
	// 		const span = document.createElement('span')
	// 		// COMPAT: In Chrome and Safari, if we don't add the `white-space` style
	// 		// then leading and trailing spaces will be ignored. (2017/09/21)
	// 		span.style.whiteSpace = 'pre'
	// 		span.appendChild(attach)
	// 		contents.appendChild(span)
	// 		attach = span
	// 	}

	// 	const fragment = Node.fragment(editor, selection)
	// 	const string = JSON.stringify(fragment)
	// 	const encoded = window.btoa(encodeURIComponent(string))
	// 	attach.setAttribute('data-slate-fragment', encoded)
	// 	dataTransfer.setData('application/x-slate-fragment', encoded)

	// 	// Add the content to a <div> so that we can get its inner HTML.
	// 	const div = document.createElement('div')
	// 	div.appendChild(contents)
	// 	dataTransfer.setData('text/html', div.innerHTML)
	// 	dataTransfer.setData('text/plain', getPlainText(div))
	// }
}

export default ClipboardUtil
