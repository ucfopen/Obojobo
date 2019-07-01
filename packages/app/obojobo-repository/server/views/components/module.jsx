require('./module.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const ModuleMenu = require('./module-menu')

class Module extends React.Component {
	constructor(props) {
		super(props)
		this.onCloseMenu = this.onCloseMenu.bind(this)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.state = {menuOpen: false}
	}

	onCloseMenu(){
		this.setState({menuOpen: false})
	}

	toggleMenu(e, force){
		const menuOpen = force | !this.state.menuOpen
		this.setState({menuOpen})
		e.preventDefault()
	}

	renderMenuButton(){
		return (
			<div onClick={this.toggleMenu} className="repository--module-icon--menu-control-button">
				<svg height="32px" viewBox="0 0 32 32" width="32px" xmlns="http://www.w3.org/2000/svg">
					<path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/>
				</svg>
			</div>
		)
	}

	renderMenu(){
		return (
			<ModuleMenu draftId={this.props.draftId} editor={this.props.editor} title={this.props.title} />
		)
	}

	render(){
		let menu = null
		let menuButton = null
		if(this.props.hasMenu){
			menuButton = this.renderMenuButton()
			if(this.state.menuOpen){
				menu = this.renderMenu()
			}
		}

		return (
			<div onMouseLeave={this.onCloseMenu} className="repository--module-icon" onClick={this.props.onClick}>
				<a href={`/library/${this.props.draftId}`} >
					<ModuleImage id={this.props.draftId} />
					{menuButton}
					<div className="repository--module-icon--title">{this.props.title}</div>
				</a>
				{menu}
				{this.props.children}
			</div>
		)
	}
}


module.exports = Module
