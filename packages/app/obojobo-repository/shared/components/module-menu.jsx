require('./module-menu.scss')

const React = require('react')
const ButtonLink = require('./button-link')
const Button = require('./button')
const { urlForEditor } = require('../repository-utils')
const { FULL, MINIMAL } = require('obojobo-express/server/constants')

const ModuleMenu = props => {
	const onShare = () => {
		props.showModulePermissions(props)
	}

	const onMore = () => {
		props.showModuleMore(props)
	}

	const onSyncButtonClick = () => {
		props.showModuleSync(props)
	}

	// accessLevel should always be set - to be safe, don't show an edit button if it isn't
	return (
		<div className="repository--module-icon--menu-wrapper">
			<div className={`repository--module-icon--menu ${props.className || ''}`}>
				<ButtonLink url={`/preview/${props.draftId}`} target="_blank">
					Preview
				</ButtonLink>
				{!props.readOnly && props.accessLevel && props.accessLevel !== MINIMAL && (
					<ButtonLink url={urlForEditor(props.editor, props.draftId)} target="_blank">
						Edit
					</ButtonLink>
				)}
				{props.readOnly && props.accessLevel && props.accessLevel !== MINIMAL && (
					<Button onClick={onSyncButtonClick}>Synchronize</Button>
				)}
				{props.accessLevel === FULL && <Button onClick={onShare}>Share</Button>}
				<hr />
				<Button onClick={onMore} className="more">
					More...
				</Button>
			</div>
		</div>
	)
}

module.exports = ModuleMenu
