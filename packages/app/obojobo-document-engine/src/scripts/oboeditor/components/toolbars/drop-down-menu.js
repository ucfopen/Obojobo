import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

import './drop-down-menu.scss'

class DropDownMenu extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			isOpen: false,
			isFocused: false,
			currentFocus: 0
		}

		this.menu = []
		this.timeOutId = null
		this.onFocusHandler = this.onFocusHandler.bind(this)
		this.onKeyDown = this.onKeyDown.bind(this)
		this.menuButton = React.createRef()
	}

	componentDidUpdate() {
		// When the menu is open, focus on the current dropdown item
		if (this.props.isOpen) {
			this.menu = this.menu.filter(Boolean)
			this.menu[this.state.currentFocus].focus()
		}
	}

	onKeyDown(event) {
		this.menu = this.menu.filter(Boolean)
		if (this.props.isOpen) event.stopPropagation()

		switch (event.key) {
			// Open the menu and set the first item as the current focus
			case 'ArrowRight':
				this.setState({ isOpen: true, currentFocus: 0 })
				event.stopPropagation()
				break

			// Close the menu and return focus to the link item
			case 'ArrowLeft':
				this.props.close()
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

	// If we focused on a child, don't close the sub-menu
	onFocusHandler() {
		clearTimeout(this.timeOutId)
	}

	renderAction(index, item) {
		const isMac = navigator.platform.indexOf('Mac') !== -1
		// Decide whether or not to use the mac shortcut
		// Note - users can spoof their appVersion, but anyone who is tech-savvy enough
		// to do that is probably tech-savvy enough to know whether they use CTRL or ⌘
		// for keyboard shortcuts
		const shortcutMac = isMac && item.shortcutMac ? '\n' + item.shortcutMac : ''
		// If the Mac shortcut exists, use it
		// If there is no Mac shortcut and no mark.shortcut, the mac shortcut will be
		// the blank string, so just use it
		const shortcut = shortcutMac || !item.shortcut ? shortcutMac : '\n' + item.shortcut

		return (
			<button
				key={index}
				onClick={item.action}
				disabled={this.props.disabled || item.disabled}
				ref={item => {
					this.menu.push(item)
				}}
			>
				{item.name}
				{shortcut ? <span>{shortcut}</span> : null}
			</button>
		)
	}

	render() {
		this.menu = []
		return (
			<div
				className={'dropdown ' + isOrNot(this.props.isOpen, 'open')}
				key={this.props.name}
				onFocus={this.onFocusHandler}
				onKeyDown={this.onKeyDown}
				ref={this.props.onRef}
				tabIndex={-1}
			>
				<button
					className="menu-title"
					onClick={this.props.toggleOpen}
					ref={this.menuButton}
					onMouseEnter={this.props.onMouseEnter}
				>
					{this.props.name}
				</button>
				<div className="menu-items">
					{this.props.menu.map((item, index) => {
						switch (item.type) {
							case 'sub-menu':
								return (
									<DropDownMenu
										key={index}
										name={item.name}
										menu={item.menu}
										onRef={item => {
											this.menu.push(item)
										}}
										disabled={this.props.disabled}
									/>
								)
							case 'toggle-action':
								return (
									<button
										key={index}
										onClick={item.action}
										disabled={this.props.disabled || item.disabled}
										ref={item => {
											this.menu.push(item)
										}}
									>
										{item.name}
										{item.value ? <span>✔</span> : null}
									</button>
								)
							default:
								return this.renderAction(index, item)
						}
					})}
				</div>
			</div>
		)
	}
}

export default DropDownMenu
