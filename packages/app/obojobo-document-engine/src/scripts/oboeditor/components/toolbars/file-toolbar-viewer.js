import React, { useMemo } from 'react'
import { ReactEditor, useEditor } from 'slate-react'
import { Range, Editor, Transforms, Element } from 'slate'
import FileToolbar from './file-toolbar'

const isInsertDisabledForItem = (selectedNodes, name, selection) => {
	if (!selection) return true

	for (const [node] of selectedNodes) {
		switch (node.type) {
			case 'ObojoboDraft.Chunks.Table':
				return true

			case 'ObojoboDraft.Chunks.Question':
				return name === 'Question' || name === 'Question Bank'
		}
	}

	return false
}

const selectAll = editor => {
	const edges = Editor.edges(editor, [])
	Transforms.select(editor, { focus: edges[0], anchor: edges[1] })
	return ReactEditor.focus(editor)
}

const FileToolbarViewer = props => {
	const { insertableItems, ...filteredProps } = props
	const editor = useEditor()
	const sel = editor.selection
	const hasSelection = sel && Range.isCollapsed(sel)
	const selectionKey = sel ? sel.anchor.path.join() + '-' + sel.focus.path.join() : 0
	const insertMenu = useMemo(() => {
		// If the selected area spans across multiple blocks, the selection is deleted before
		// inserting, colapsing it down to the type of the first block
		const selectedNodes = (() => {
			if (!editor.selection) return []
			return Array.from(
				Editor.nodes(editor, {
					at: Editor.path(editor, editor.selection, { edge: 'start' }),
					match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
				})
			)
		})()

		const insertMenuItems = insertableItems.map(item => ({
			name: item.name,
			action: () => {
				Transforms.insertNodes(editor, item.cloneBlankNode())
				ReactEditor.focus(editor)
			},
			disabled: isInsertDisabledForItem(selectedNodes, item.name, sel)
		}))

		return insertMenuItems
	}, [selectionKey])

	return (
		<FileToolbar
			{...filteredProps}
			editor={editor}
			insertMenu={insertMenu}
			hasSelection={hasSelection}
			selectAll={selectAll}
		/>
	)
}

export default FileToolbarViewer
