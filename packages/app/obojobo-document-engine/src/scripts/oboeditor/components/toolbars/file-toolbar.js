import React from 'react'
import Common from 'Common'

import FileMenu from './file-menu'
import DropDownMenu from './drop-down-menu'

import './file-toolbar.scss'

const FileToolbar = props => {
	const editMenu = {
		name: 'Edit',
		menu: [
			{ name: 'Undo', type: 'action' },
			{ name: 'Redo', type: 'action' },
			{ name: 'Cut', type: 'action' },
			{ name: 'Copy', type: 'action' },
			{ name: 'Paste', type: 'action' },
			{ name: 'Paste without formatting', type: 'action' },
			{ name: 'Delete', type: 'action' },
			{ name: 'Select all', type: 'action' }
		]
	}

	const viewMenu = {
		name: 'View',
		menu: [
			{ name: 'Visual Editor', type: 'action' },
			{ name: 'XML Editor', type: 'action' },
			{ name: 'JSON Editor', type: 'action' },
			{ name: 'Preview Module', type: 'action' }
		]
	}

	const insertMenu = {
		name: 'Insert',
		menu: Common.Registry.getItems(items => Array.from(items.values()))
	}

	const formatMenu = {
		name: 'Format',
		menu: [
			{
				name: 'Text',
				type: 'sub-menu',
				menu: [
					{ name: 'Bold', type: 'action' },
					{ name: 'Italic', type: 'action' },
					{ name: 'Strikethrough', type: 'action' },
					{ name: 'Quote', type: 'action' },
					{ name: 'Monospace', type: 'action' },
					{ name: 'LaTeX', type: 'action' },
					{ name: 'Link', type: 'action' },
					{ name: 'Superscript', type: 'action' },
					{ name: 'Subscript', type: 'action' }
				]
			},
			{
				name: 'Paragraph styles',
				type: 'sub-menu',
				menu: [
					{ name: 'Normal Text', type: 'action' },
					{ name: 'Heading 1', type: 'action' },
					{ name: 'Heading 2', type: 'action' },
					{ name: 'Heading 3', type: 'action' },
					{ name: 'Heading 4', type: 'action' },
					{ name: 'Heading 5', type: 'action' },
					{ name: 'Heading 6', type: 'action' }
				]
			},
			{
				name: 'Align & indent',
				type: 'sub-menu',
				menu: [
					{ name: 'Left', type: 'action' },
					{ name: 'Center', type: 'action' },
					{ name: 'Right', type: 'action' },
					{ name: 'Quote', type: 'action' },
					{ name: 'Increase Indent', type: 'action' },
					{ name: 'Decrease Indent', type: 'action' }
				]
			},
			{
				name: 'Bullets & numbering',
				type: 'sub-menu',
				menu: [
					{
						name: 'Bulletted List',
						type: 'sub-menu',
						menu: [
							{ name: 'Disc', type: 'action' },
							{ name: 'Circle', type: 'action' },
							{ name: 'Square', type: 'action' }
						]
					},
					{
						name: 'Numbered List',
						type: 'sub-menu',
						menu: [
							{ name: 'Numbers', type: 'action' },
							{ name: 'Uppercase Alphabet', type: 'action' },
							{ name: 'Uppercase Roman Numerals', type: 'action' },
							{ name: 'Lowercase Alphabet', type: 'action' },
							{ name: 'Lowercase Roman Numerals', type: 'action' }
						]
					},
				]
			}
		]
	}

	return (
		<div className={`visual-editor--file-toolbar`}>
			<FileMenu model={props.model} draftId={props.draftId} exportToJSON={props.exportToJSON} />
			<DropDownMenu menu={editMenu} />
			<DropDownMenu menu={viewMenu}/>
			<DropDownMenu menu={insertMenu}/>
			<DropDownMenu menu={formatMenu}/>
		</div>
	)
}

export default FileToolbar
