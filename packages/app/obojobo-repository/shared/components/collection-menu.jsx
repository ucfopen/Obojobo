/* eslint-disable no-console */
require('./collection-menu.scss')

const React = require('react')
const Button = require('./button')

const CollectionMenu = props => {
	const onRename = () => {
		props.showCollectionRename(props.collection)
	}

	const onDelete = () => {
		const response = confirm(
			`Delete collection "${props.collection.title}"? Modules in this collection will not be deleted.`
		) //eslint-disable-line no-alert, no-undef
		if (!response) return
		console.log('DELETE COLLECTION ', props.collection.id)
		props.deleteCollection(props.collection)
	}

	return (
		<div className="repository--module-icon--menu-wrapper">
			<div className={`repository--module-icon--menu ${props.className || ''}`}>
				<Button onClick={onRename} className="rename">
					Rename
				</Button>
				<Button onClick={onDelete} className="dangerous-button">
					Delete
				</Button>
			</div>
		</div>
	)
}

module.exports = CollectionMenu
