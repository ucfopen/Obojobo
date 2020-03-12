/* eslint-disable no-console */
require('./collection-menu.scss')

const React = require('react')
const Button = require('./button')

const CollectionMenu = props => {
	const onAddModule = () => {
		props.showCollectionAddModule(props.collection)
	}

	const onRename = () => {
		props.showCollectionRename(props.collection)
	}

	const onDelete = () => {
		//eslint-disable-next-line no-alert, no-undef
		const response = confirm(
			`Delete collection "${props.collection.title}"? Modules in this collection will not be deleted.`
		)
		if (!response) return
		props.deleteCollection(props.collection)
	}

	return (
		<div className="repository--module-icon--menu-wrapper">
			<div className={`repository--module-icon--menu ${props.className || ''}`}>
				<Button onClick={onAddModule} className="add-module">
					Add Module
				</Button>
				<Button onClick={onRename} className="rename">
					Rename
				</Button>
				<hr />
				<Button onClick={onDelete} className="dangerous-button">
					Delete
				</Button>
			</div>
		</div>
	)
}

module.exports = CollectionMenu
