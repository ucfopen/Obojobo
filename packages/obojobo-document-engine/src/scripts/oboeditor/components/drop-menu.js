/* eslint no-alert: 0 */
import React from 'react'
import isOrNot from '../../common/isornot'

import './drop-menu.scss'

class DropMenu extends React.Component {
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
		// This is called after renderDropDown so that the proper ref setup has
		// already occurred
		// It adds the dropdown button references into the menu list so they can be
		// accessed via up and down arrows
		this.menu = []
		this.props.dropOptions.forEach(item => {
			this.menu.push(this[item])
		})

		// When the menu is open, focus on the current dropdown item
		if (this.state.isOpen) {
			this.menu[this.state.currentFocus].focus()
		}
	}

	onKeyDown(event) {
		// Open the menu and set the first item as the current focus
		if (event.key === 'ArrowRight') {
			this.setState({
				isOpen: true,
				currentFocus: 0
			})
		}

		// Close the menu and return focus to the link item
		if (event.key === 'ArrowLeft' || event.key === 'Escape') {
			this.setState({ isOpen: false })
			this.mainButton.focus()
		}

		// Move down through the submenu
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			this.setState(currentState => ({
				currentFocus: (currentState.currentFocus + 1) % this.menu.length
			}))
		}

		// Move up through the submenu
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			this.setState(currentState => ({
				currentFocus: (currentState.currentFocus - 1) % this.menu.length
			}))
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

	renderItem(item) {
		return (
			<button
				key={item}
				tabIndex="-1"
				ref={button => {
					this[item] = button
				}}
				onClick={() => {
					if(item.onClick) return item.onClick()
					return this.props.masterOnClick(item)
				}}>
				{item}
			</button>
		)
	}

	render() {
		return (
			<div
				className={'dropdown-menu ' + isOrNot(this.state.isOpen, 'open') + ' ' + this.props.className}
				contentEditable={false}
				onKeyDown={event => this.onKeyDown(event)}
				onBlur={() => this.onBlurHandler()}
				onFocus={() => this.onFocusHandler()}>
				<button
					className={'drop-icon'}
					ref={button => {
						this.mainButton = button
					}}>
					{this.props.icon}
				</button>
				<div className={isOrNot(this.state.isOpen, 'open')}>
					{this.props.dropOptions.map(item => {
						return this.renderItem(item)
					})}
				</div>
			</div>
		)
	}
}

export default DropMenu
