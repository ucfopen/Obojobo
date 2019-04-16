import React from 'react'
import Common from 'Common'
import EditorUtil from '../util/editor-util'
import ClipboardUtil from '../util/clipboard-util'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

import './drop-down-menu.scss'

const { OboModel } = Common.models

class SubMenu extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isOpen: false,
			isFocused: false,
			currentFocus: 0
		}

		this.menu = []
		this.timeOutId = null
	}

	componentDidUpdate() {
		// When the menu is open, focus on the current dropdown item
		if (this.state.isOpen) {
			this.menu[this.state.currentFocus].focus()
		}
	}

	onKeyDown(event) {
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

	renderSubMenu(submenu) {
		return (
			<div className={'dropdown ' + isOrNot(this.state.isOpen, 'open')}>
				<button className="menu-title">{submenu.name}</button>
				<div className="menu-items">
					{submenu.menu.map(item => {
						switch(item.type) {
							case 'sub-menu':
								return (this.renderSubMenu(item))
							default:
								return (<button key={item.name}>{item.name}</button>)
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
		return (
			<div
				className="visual-editor--drop-down-menu"
				onClick={this.props.onClick}
				onBlur={() => this.onBlurHandler()}
				onFocus={() => this.onFocusHandler()}
				onKeyDown={event => this.onKeyDown(event)}>
				{this.renderSubMenu(this.props.menu)}
			</div>
		)
	}
}

export default SubMenu
