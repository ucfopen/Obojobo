require('./module-menu.scss')

const React = require('react')
const ButtonLink = require('./button-link')
const Button = require('./button')

const urlForEditor = (editor, draftId) => {
	if(editor === 'visual') return `/editor/${draftId}`
	return `/editor#id:${draftId}`
}

const ModuleMenu = props => {
	const onShare = () => {
		props.showModulePermissions(props)
	}
	const onDelete = () => {
		var response = confirm(`Delete "${props.title}" id: ${props.draftId} ?`)
		if(!response) return;
		props.deleteModule(props.draftId)
	}
	return (
		<div className="repository--module-icon--menu-wrapper" >
			<div className={`repository--module-icon--menu ${props.className || ''}`}>
				<ButtonLink url={`/preview/${props.draftId}`} target="_blank" >Preview</ButtonLink>
				<ButtonLink url={urlForEditor(props.editor, props.draftId)} target="_blank">Edit</ButtonLink>
				<Button onClick={onShare} >Share</Button>
				<Button onClick={onDelete} className="delete" >Delete</Button>
			</div>
		</div>
	)
}

module.exports = ModuleMenu
