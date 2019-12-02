import './paragraph-styles.scss'

import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

class ParagraphStyles extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isOpen: false,
			currentFocus: 0
		}

		this.timeOutId = null
		this.menu = []
		this.toggleLevelSelect = this.toggleLevelSelect.bind(this)
		this.onBlurHandler = this.onBlurHandler.bind(this)
		this.onFocusHandler = this.onFocusHandler.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
		this.menuButton = React.createRef()
	}

	componentDidUpdate() {
		// When the menu is open, focus on the current dropdown item
		if (this.state.isOpen) {
			this.menu = this.menu.filter(Boolean)
			this.menu[this.state.currentFocus].focus()
		}
	}

	// The timeout gives the blur time to check for child focus
	onBlurHandler() {
		this.timeOutId = setTimeout(() => {
			this.setState({
				isOpen: false
			})
		})
	}

	// If we focused on a child, don't close the sub-menu
	onFocusHandler() {
		clearTimeout(this.timeOutId)
	}

	onKeyDown(event) {
		this.menu = this.menu.filter(Boolean)
		if (this.state.isOpen) event.stopPropagation()

		switch (event.key) {
			// Open the menu and set the first item as the current focus
			case 'ArrowRight':
				this.setState({ isOpen: true, currentFocus: 0 })
				event.stopPropagation()
				break

			// Close the menu and return focus to the link item
			case 'ArrowLeft':
				this.setState({ isOpen: false })
				this.menuButton.current.focus()
				break

			// Move down through the submenu
			case 'ArrowDown':
				this.setState(currentState => ({
					currentFocus: (currentState.currentFocus + 1) % this.menu.length
				}))
				break

			// Move up through the submenu
			case 'ArrowUp':
				this.setState(currentState => ({
					currentFocus: (currentState.currentFocus + this.menu.length - 1) % this.menu.length
				}))
				break
		}
	}

	toggleLevelSelect() {
		this.setState(state => {
			return { isOpen: !state.isOpen }
		})
	}

	reduceHeading(value) {
		const nodeLevel = value.blocks.reduce(
			(accum, block) => accum === block.data.get('content').level ? accum : "", 
			value.blocks.get(0).data.get('content').level
		)

		if(nodeLevel) return 'Heading ' + nodeLevel

		return ""
	}

	getParagraphStyle(value) {
		const nodeType = value.blocks.reduce(
			(accum, block) => accum === block.type ? accum : "", 
			value.blocks.get(0).type
		)

		switch(nodeType){
			case HEADING_NODE: return this.reduceHeading(value)
			case CODE_LINE_NODE: return "Code"
			case TEXT_LINE_NODE: return "Normal Text"
			default: return "No Style"
		}
	}

	render() {
		return (
			<div 
				className={'paragraph-styles'} 
				contentEditable={false}
				onBlur={this.onBlurHandler}
				onFocus={this.onFocusHandler}
				onKeyDown={this.onKeyDown}>
				<button 
					onClick={this.toggleLevelSelect}
					ref={this.menuButton}>
					{this.getParagraphStyle(this.props.value)}
					<span className={isOrNot(this.state.isOpen, 'open')}>{'⌃'}</span>
				</button>
				<div className={'paragraph-styles-menu ' + isOrNot(this.state.isOpen, 'open')}>
					<button 
						onClick={() => this.props.editor.current.changeToType(TEXT_NODE)}
						ref={item => {
							this.menu.push(item)
						}}>
						<p>Normal Text</p>
					</button>
					<button 
						onClick={() => this.props.editor.current.changeToType(CODE_NODE)}
						ref={item => {
							this.menu.push(item)
						}}>
						<pre>Code</pre>
					</button>
					<button 
						onClick={() => this.props.editor.current.changeToType(HEADING_NODE, { level: 1 })}
						ref={item => {
							this.menu.push(item)
						}}>
						<h1>Heading 1</h1>
					</button>
					<button 
						onClick={() => this.props.editor.current.changeToType(HEADING_NODE, { level: 2 })}
						ref={item => {
							this.menu.push(item)
						}}>
						<h2>Heading 2</h2>
					</button>
					<button 
						onClick={() => this.props.editor.current.changeToType(HEADING_NODE, { level: 3 })}
						ref={item => {
							this.menu.push(item)
						}}>
						<h3>Heading 3</h3>
					</button>
					<button 
						onClick={() => this.props.editor.current.changeToType(HEADING_NODE, { level: 4 })}
						ref={item => {
							this.menu.push(item)
						}}>
						<h4>Heading 4</h4>
					</button>
					<button 
						onClick={() => this.props.editor.current.changeToType(HEADING_NODE, { level: 5 })}
						ref={item => {
							this.menu.push(item)
						}}>
						<h5>Heading 5</h5>
					</button>
					<button 
						onClick={() => this.props.editor.current.changeToType(HEADING_NODE, { level: 6 })}
						ref={item => {
							this.menu.push(item)
						}}>
						<h6>Heading 6</h6>
					</button>
				</div>
			</div>
		)
	}
}

export default ParagraphStyles
