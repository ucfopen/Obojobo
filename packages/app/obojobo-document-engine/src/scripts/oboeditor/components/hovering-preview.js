import React, { useRef, useEffect } from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Range } from 'slate'
import ReactDOM from 'react-dom'
import katex from 'katex'

import './hovering-preview.scss'

const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}

const HoveringPreview = () => {
	const ref = useRef()
	const editor = useSlate()

	useEffect(() => {
		const el = ref.current
		const { selection } = editor

		if (!el) {
			return
		}

		if (
			!selection ||
			!ReactEditor.isFocused(editor)
		) {
			console.log('in here')
			el.removeAttribute('style')
			return
		}

		console.log('go team rocket!')

		const domSelection = window.getSelection()
		const domRange = domSelection.getRangeAt(0)
		const rect = domRange.commonAncestorContainer.parentNode.getBoundingClientRect()
		// Special styling to make the preview box appear above the content
		el.style.opacity = 1
		el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 6}px`
		el.style.left = `${rect.left +
			window.pageXOffset -
			el.offsetWidth / 2 +
			rect.width / 2}px`
	})

	return (
		<div contentEditable={false} className="hovering-preview" ref={ref}>
			<p>Preview:</p>
			<span
				className="preview-latex"
				dangerouslySetInnerHTML={{
					__html: katex.renderToString('mock\\ text', {
						throwOnError: false
					})
				}}
			/>
		</div>
	)
}

export default HoveringPreview