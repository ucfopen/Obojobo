require('./collection-module-list-item.scss')

const React = require('react')
const ModuleImage = require('./module-image')

const CollectionModuleListItem = props => (
	<li className="module-list-item">
		<ModuleImage id={props.draftId} />
		<div className="module-title">{props.title}</div>
		{props.children}
	</li>
)

module.exports = CollectionModuleListItem
