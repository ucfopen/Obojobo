import React, { useRef, useEffect } from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor } from 'slate'
import katex from 'katex'

import './hovering-preview.scss'
const LATEX_MARK = '_latex'

const HoveringPreview = props => {
	const pageEditorContainerRef = props.pageEditorContainerRef
	const ref = useRef()
	const editor = useSlate()
	const [leaf] = editor.selection
		? Editor.leaf(editor, editor.selection, { edge: 'start' })
		: [{ text: '' }, []]

	useEffect(() => {
		const el = ref.current
		const pageEditorContainerEl = pageEditorContainerRef.current
		const { selection } = editor

		if (!el) {
			return
		}

		if (!selection || !ReactEditor.isFocused(editor) || !leaf[LATEX_MARK]) {
			el.removeAttribute('style')
			return
		}

		const domSelection = window.getSelection()
		const domRange = domSelection.getRangeAt(0)
		const parent = domRange.commonAncestorContainer.parentNode

		// If the parent is not a span, we have selected across multiple pieces of text
		// so we should hide the preview to prevent chaos as multiple previews pop up
		if (parent.tagName.toLowerCase() !== 'span') {
			el.removeAttribute('style')
			return
		}

		const pageEditorRect = pageEditorContainerEl.getBoundingClientRect()
		const rect = parent.getBoundingClientRect()
		// Special styling to make the preview box appear above the content
		el.style.opacity = 1
		el.style.top = `${rect.top - pageEditorRect.top - el.offsetHeight - 6}px`
		el.style.left = `${rect.left - pageEditorRect.left - el.offsetWidth / 2 + rect.width / 2}px`
	})

	return (
		<div contentEditable={false} className="hovering-preview" ref={ref}>
			<p>Preview:</p>
			<span
				className="preview-latex"
				dangerouslySetInnerHTML={{
					__html: katex.renderToString(leaf.text, {
						throwOnError: false
					})
				}}
			/>
		</div>
	)
}

export default HoveringPreview
