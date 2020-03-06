/* eslint-disable no-console */
require('./collection-menu.scss')

const React = require('react')
const Button = require('./button')

const CollectionMenu = props => {
	const onRename = () => {
		props.showCollectionRename(props.collection)
	}

	return (
		<div className="repository--module-icon--menu-wrapper">
			<div className={`repository--module-icon--menu ${props.className || ''}`}>
				<hr />
				<Button onClick={onRename} className="rename">
					Rename
				</Button>
			</div>
		</div>
	)
}

module.exports = CollectionMenu
