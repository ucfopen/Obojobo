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

	return (
		<div className="repository--module-icon--menu-wrapper">
			<div className={`repository--module-icon--menu ${props.className || ''}`}>
				<ButtonLink url={`/preview/${props.draftId}`} target="_blank">
					Preview
				</ButtonLink>
				{props.accessLevel !== MINIMAL && (
					<ButtonLink url={urlForEditor(props.editor, props.draftId)} target="_blank">
						Edit
					</ButtonLink>
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
