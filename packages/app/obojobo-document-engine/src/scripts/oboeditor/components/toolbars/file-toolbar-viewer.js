import React, { useMemo } from 'react'
import { ReactEditor, useEditor } from 'slate-react'
import { Range, Editor, Transforms, Element } from 'slate'
import FileToolbar from './file-toolbar'
import DropDownMenu from './drop-down-menu'
import FormatMenu from './format-menu'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

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

const containsFigureNode = selectedNodes => {
	for (const [node] of selectedNodes) {
		if (node.type === 'ObojoboDraft.Chunks.Figure') {
			return true
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

		const insertMenuItems = insertableItems.map(item => {
			return {
				name: item.name,
				action: () => {
					const path = Editor.path(editor, editor.selection, { edge: 'start' })
					const prevChildrenCount = editor.children.length

					Transforms.insertNodes(editor, item.cloneBlankNode())

					// Since inserting a node inside a figure caption can sometimes
					// cause figure to be duplicated after the caption is split, we
					// need to convert the duplicated figure below to a text node.
					if (
						containsFigureNode(selectedNodes) &&
						editor.children.length !== prevChildrenCount + 1
					) {
						// Because we want the figure two lines below,
						// we need to ignore the last value in the path since
						// it refers to the figure's caption.
						const newPath = [...path.slice(0, path.length - 1)]
						newPath[newPath.length - 1] += 2

						Transforms.setNodes(
							editor,
							{
								type: TEXT_NODE,
								content: {}
							},
							{
								at: [...newPath]
							}
						)
					}
					ReactEditor.focus(editor)
				},
				disabled: isInsertDisabledForItem(selectedNodes, item.name, sel)
			}
		})

		return (
			<div className="visual-editor--drop-down-menu">
				<DropDownMenu name="Insert" menu={insertMenuItems} />
			</div>
		)
	}, [selectionKey])

	return (
		<FileToolbar
			{...filteredProps}
			editor={editor}
			selectionKey={selectionKey}
			insertMenu={insertMenu}
			formatMenu={<FormatMenu hasSelection={hasSelection} />}
			selectAll={selectAll}
			isDeletable={hasSelection}
		/>
	)
}

export default FileToolbarViewer
