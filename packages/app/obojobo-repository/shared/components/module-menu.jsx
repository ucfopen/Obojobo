require('./module-menu.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const ButtonLink = require('./button-link')
const Button = require('./button')

class ModuleMenu extends React.Component {
	constructor(props) {
		super(props)
		this.onShare = this.onShare.bind(this)
		this.onDelete = this.onDelete.bind(this)
	}

	urlForEditor(editor, draftId){
		if(editor === 'visual'){
			return `/editor/${draftId}`
		}
		return `/editor#id:${draftId}`
	}

	onShare(e){
		this.props.showModulePermissions(this.props)
		e.preventDefault()
	}

	onDelete(){
		var response = confirm(`Delete "${this.props.title}" id: ${this.props.draftId} ?`)
		if(!response) return;
		this.props.deleteModule(this.props.draftId)
		e.preventDefault()
	}

	render(){
		return (
			<div className="repository--module-icon--menu-wrapper" >
				<div className={`repository--module-icon--menu ${this.props.className || ''}`}>
					{ /* <ButtonLink url={`/library/${this.props.draftId}`} target="_blank" >Overview</ButtonLink> */ }
					<ButtonLink url={`/preview/${this.props.draftId}`} target="_blank" >Preview</ButtonLink>
					<ButtonLink url={this.urlForEditor(this.props.editor, this.props.draftId)} target="_blank">Edit</ButtonLink>
					<Button onClick={this.onShare} >Share</Button>
					<Button onClick={this.onDelete} className="delete" >Delete</Button>
				</div>
			</div>
		)
	}
}

module.exports = ModuleMenu
