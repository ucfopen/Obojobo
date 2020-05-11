import React, { memo } from 'react'
import { Range, Editor, Transforms, Element } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'

import FileMenu from './file-menu'
import ViewMenu from './view-menu'
import FormatMenu from './format-menu'
import DropDownMenu from './drop-down-menu'

import './file-toolbar.scss'

const { Button } = Common.components

const insertDisabled = (name, editor) => {
	if (!editor.selection) return true
	// If the selected area spans across multiple blocks, the selection is deleted before
	// inserting, colapsing it down to the type of the first block
	// Any node in the tree
	const list = Array.from(
		Editor.nodes(editor, {
			at: Editor.path(editor, editor.selection, { edge: 'start' }),
			match: node => Element.isElement(node) && !editor.isInline(node) && !node.subtype
		})
	)

	if (list.some(([node]) => node.type === 'ObojoboDraft.Chunks.Table')) return true

	if (list.some(([node]) => node.type === 'ObojoboDraft.Chunks.Question')) {
		if (name === 'Question' || name === 'Question Bank') return true

		return false
	}

	return false
}

const selectAll = editor => {
	if (Editor.isEditor(editor)) {
		const edges = Editor.edges(editor, [])
		Transforms.select(editor, { focus: edges[0], anchor: edges[1] })
		return ReactEditor.focus(editor)
	}

	editor.selectAll()
}

const openPreview = draftId => {
	const previewURL = window.location.origin + '/preview/' + draftId
	window.open(previewURL, '_blank')
}

class FileToolbar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isOpen: false,
			curItem: null
		}

		this.node = React.createRef()
		this.close = this.close.bind(this)
		this.toggleOpen = this.toggleOpen.bind(this)
		this.onMouseEnter = this.onMouseEnter.bind(this)
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.clickOutside.bind(this), false)
	}

	clickOutside(e) {
		if (!this.node.current.contains(e.target)) {
			this.setState({ isOpen: false })
		}
	}

	close() {
		this.setState({ isOpen: false, curItem: null })
	}

	toggleOpen(e) {
		this.setState({ isOpen: !this.state.isOpen, curItem: e.target.innerText })
	}

	onMouseEnter(e) {
		this.setState({ curItem: e.target.innerText })
	}

	render() {
		// insert actions on menu items
		// note that `editor.current` needs to be evaluated at execution time of the action!
		const props = this.props
		const editor = props.editor
		const insertMenu = props.insertableItems.map(item => ({
			name: item.name,
			action: () => {
				Transforms.insertNodes(editor, item.cloneBlankNode())
				ReactEditor.focus(editor)
			},
			disabled: insertDisabled(item.name, editor, props.value)
		}))

		const editMenu = [
			{ name: 'Undo', type: 'action', action: () => editor.undo() },
			{ name: 'Redo', type: 'action', action: () => editor.redo() },
			{
				name: 'Delete',
				type: 'action',
				action: () => editor.deleteFragment(),
				disabled:
					props.mode !== 'visual' || !editor.selection || Range.isCollapsed(editor.selection)
			},
			{ name: 'Select all', type: 'action', action: () => selectAll(editor) }
		]

		const { isOpen, curItem } = this.state

		const saved = props.saved ? 'saved' : ''
		return (
			<div className={`visual-editor--file-toolbar`} ref={this.node}>
				<FileMenu
					title={props.title}
					draftId={props.draftId}
					onSave={props.onSave}
					reload={props.reload}
					mode={props.mode}
					isOpen={isOpen && curItem === 'File'}
					close={this.close}
					toggleOpen={this.toggleOpen}
					onMouseEnter={this.onMouseEnter}
				/>
				<div className="visual-editor--drop-down-menu">
					<DropDownMenu
						name="Edit"
						menu={editMenu}
						isOpen={isOpen && curItem === 'Edit'}
						close={this.close}
						toggleOpen={this.toggleOpen}
						onMouseEnter={this.onMouseEnter}
					/>
				</div>
				<ViewMenu
					draftId={props.draftId}
					switchMode={props.switchMode}
					onSave={props.onSave}
					mode={props.mode}
					isOpen={isOpen && curItem === 'View'}
					close={this.close}
					toggleOpen={this.toggleOpen}
					onMouseEnter={this.onMouseEnter}
				/>

				{props.mode === 'visual' ? (
					<div className="visual-editor--drop-down-menu">
						<DropDownMenu
							name="Insert"
							menu={insertMenu}
							isOpen={isOpen && curItem === 'Insert'}
							close={this.close}
							toggleOpen={this.toggleOpen}
							onMouseEnter={this.onMouseEnter}
						/>
					</div>
				) : null}
				{props.mode === 'visual' ? (
					<FormatMenu
						editor={editor}
						value={props.value}
						isOpen={isOpen && curItem === 'Format'}
						close={this.close}
						toggleOpen={this.toggleOpen}
						onMouseEnter={this.onMouseEnter}
					/>
				) : null}
				<div className={'saved-message ' + saved}>Saved!</div>
				<Button onClick={openPreview.bind(this, props.draftId)} className={'preview-button'}>
					Preview Module
				</Button>
			</div>
		)
	}
}

export default memo(FileToolbar)
