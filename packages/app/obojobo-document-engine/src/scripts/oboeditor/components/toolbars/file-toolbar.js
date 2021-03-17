import React, { memo } from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import FileMenu from './file-menu'
import ViewMenu from './view-menu'
import FormatMenu from './format-menu'
import DropDownMenu from './drop-down-menu'

import './file-toolbar.scss'

const { Button } = Common.components

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
		this.setState({ isOpen: false })
	}

	toggleOpen(e) {
		this.setState({ isOpen: !this.state.isOpen, curItem: e.target.innerText })
	}

	onMouseEnter(e) {
		this.setState({ curItem: e.target.innerText })
	}

	render() {
		const props = this.props
		const { isOpen, curItem } = this.state

		const saved = props.saved ? 'saved' : ''

		const editor = props.editor
		const selectAll = props.selectAll || editor.selectAll
		const editMenu = [
			{ name: 'Undo', type: 'action', action: () => editor.undo() },
			{ name: 'Redo', type: 'action', action: () => editor.redo() },
			{
				name: 'Delete',
				type: 'action',
				action: () => editor.deleteFragment(),
				disabled: props.hasSelection === null ? true : props.hasSelection
			},
			{ name: 'Select all', type: 'action', action: () => selectAll(editor) }
		]

		return (
			<div className={'visual-editor--file-toolbar'} ref={this.node}>
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
					mode={props.mode}
					onSave={props.onSave}
					isOpen={isOpen && curItem === 'View'}
					close={this.close}
					toggleOpen={this.toggleOpen}
					onMouseEnter={this.onMouseEnter}
				/>
				{props.mode === 'visual' ? (
					<div className="visual-editor--drop-down-menu">
						<DropDownMenu
							name="Insert"
							menu={props.insertMenu}
							isOpen={isOpen && curItem === 'Insert'}
							close={this.close}
							toggleOpen={this.toggleOpen}
							onMouseEnter={this.onMouseEnter}
						/>
					</div>
				) : null}
				{props.mode === 'visual' ? (
					<FormatMenu
						hasSelection={props.hasSelection}
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
