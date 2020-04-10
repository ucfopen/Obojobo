import React, { useRef, useLayoutEffect, useMemo } from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor } from 'slate'
import katex from 'katex'

import './hovering-preview.scss'
const LATEX_MARK = '_latex'

const HoveringPreview = ({ pageEditorContainerRef }) => {
	const ref = useRef()
	const editor = useSlate()
	const [leaf] = editor.selection
		? Editor.leaf(editor, editor.selection, { edge: 'start' })
		: [{ text: '' }, []]

	// SHOW, HIDE, AND UPDATE LOCATION ON SCREEN
	// only runs when text changes OR window width changes
	useLayoutEffect(() => {
		// bail if nothing selected
		const el = ref.current
		if (!el) return

		// bail if editor isnt selecting a latex mark
		if (!editor.selection || !ReactEditor.isFocused(editor) || !leaf[LATEX_MARK]) {
			el.removeAttribute('style') // remove any styles we created
			return
		}

		// locate the dom's selected element's parent
		const domSelection = window.getSelection()
		const domRange = domSelection.getRangeAt(0)
		const parent = domRange.commonAncestorContainer.parentNode

		// If the parent is not a span, we have selected across multiple pieces of text
		// so we should hide the preview to prevent chaos as multiple previews pop up
		if (parent.tagName.toLowerCase() !== 'span') {
			el.removeAttribute('style')
			return
		}

		// Calculate styles to set display location
		const pageEditorRect = pageEditorContainerRef.current.getBoundingClientRect()
		const rect = parent.getBoundingClientRect()
		el.style.opacity = 1
		el.style.top = `${rect.top - pageEditorRect.top - el.offsetHeight - 6}px`
		el.style.left = `${rect.left - pageEditorRect.left - el.offsetWidth / 2 + rect.width / 2}px`
	}, [window.innerWidth, leaf.text, leaf])

	// RENDER KATEX HTML
	// run only when text changes
	const katexHTML = useMemo(() => {
		if (!leaf[LATEX_MARK]) return ''
		return katex.renderToString(leaf.text, { throwOnError: false })
	}, [leaf.text])

	return (
		<div contentEditable={false} className="hovering-preview" ref={ref}>
			<p>Preview:</p>
			<span
				className="preview-latex"
				dangerouslySetInnerHTML={{
					__html: katexHTML
				}}
			/>
		</div>
	)
}

export default HoveringPreview
