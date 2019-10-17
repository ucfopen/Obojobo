import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

import './drop-down-menu.scss'

class DropMenu extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			isOpen: false,
			isFocused: false,
			currentFocus: 0
		}

		this.menu = []
		this.timeOutId = null
		this.onBlurHandler = this.onBlurHandler.bind(this)
		this.onFocusHandler = this.onFocusHandler.bind(this)
		this.toggleOpen = this.toggleOpen.bind(this)
	}

	componentDidUpdate() {
		// When the menu is open, focus on the current dropdown item
		if (this.state.isOpen) {
			this.menu = this.menu.filter(Boolean)
			this.menu[this.state.currentFocus].focus()
		}
	}

	onKeyDown(event) {
		this.menu = this.menu.filter(Boolean)
		if(this.state.isOpen) event.stopPropagation()
		console.log(this.menu)
		switch (event.key) {
			// Open the menu and set the first item as the current focus
			case 'ArrowRight':
				this.setState({ isOpen: true, currentFocus: 0 })
				break

			// Close the menu and return focus to the link item
			case 'ArrowLeft':
				this.setState({ isOpen: false })
				this.linkButton.focus()
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
					currentFocus: (currentState.currentFocus - 1) % this.menu.length
				}))
				break
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

	toggleOpen() {
		this.setState(prevState => ({ isOpen: !prevState.isOpen }))
	}

	renderSubMenu(name, menu) {
		this.menu = []
		return (
			<div
				className={'dropdown ' + isOrNot(this.state.isOpen, 'open')}
				key={name}
				onBlur={this.onBlurHandler}
				onFocus={this.onFocusHandler}
				onKeyDown={event => this.onKeyDown(event)}
				ref={this.props.onRef}
				tabIndex={-1}>
				<button 
					className="menu-title"
					onClick={this.toggleOpen}
					ref={item => {this.menu.push(item)}}>
					{name}
				</button>
				<div className="menu-items">
					{menu.map(item => {
						switch(item.type) {
							case 'sub-menu':
								return <DropMenu name={item.name} menu={item.menu} onRef={item => {this.menu.push(item)}}/>
							default:
								return (
									<button
										key={item.name}
										onClick={item.action}
										disabled={item.disabled}
										ref={item => {this.menu.push(item)}}>
										{item.name}
									</button>
								)
						}
					})}
				</div>
			</div>
		)
	}

	// This is called after renderDropDown so that the proper ref setup has
	// already occurred
	linkReferences() {
		this.menu = []
		if (this.moveUp) this.menu.push(this.moveUp)
		if (this.moveDown) this.menu.push(this.moveDown)
		this.menu.push(this.editName)
		this.menu.push(this.delete)
		this.menu.push(this.getId)
	}

	render() {
		return this.renderSubMenu(this.props.name, this.props.menu)
	}
}

export default DropMenu
