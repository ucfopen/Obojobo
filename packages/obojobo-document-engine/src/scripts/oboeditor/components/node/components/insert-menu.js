import React from 'react'
import isOrNot from '../../../../common/isornot'

import './insert-menu.scss'

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

	openMenu(){
		this.setState({
			isOpen: true,
			currentFocus: 0
		})
	}

	componentDidUpdate() {
		// This is called after renderDropDown so that the proper ref setup has
		// already occurred
		// It adds the dropdown button references into the menu list so they can be
		// accessed via up and down arrows
		this.menu = []
		this.props.dropOptions.forEach(item => {
			if(item.isInsertable) this.menu.push(this[item.name])
		})

		// When the menu is open, focus on the current dropdown item
		if (this.state.isOpen) {
			this.menu[this.state.currentFocus].focus()
		}
	}

	onKeyDown(event) {
		if(event.key === 'Escape') {
			event.preventDefault()
			this.setState({
				isOpen: false
			})
			this.mainButton.focus()
		}

		// Move right/up through the insert menu
		if (event.key === 'ArrowRight') {
			event.preventDefault()
			this.setState(currentState => ({
				currentFocus: (currentState.currentFocus + 1) % this.menu.length
			}))
		}

		// Move left/down through the insert menu
		if (event.key === 'ArrowLeft') {
			event.preventDefault()
			this.setState(currentState => ({
				currentFocus: (currentState.currentFocus + this.menu.length - 1) % this.menu.length
			}))
		}

		// Move left/down through the insert menu
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			this.setState(currentState => ({
				currentFocus: (currentState.currentFocus + 1) % this.menu.length
			}))
		}

		// Move right/up through the insert menu
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			this.setState(currentState => ({
				currentFocus: (currentState.currentFocus + this.menu.length  - 1) % this.menu.length
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
		if (!item.isInsertable) return null
		const Icon = item.icon
		return (
			<div key={item.name} className="insert-button">
				<button
					tabIndex="-1"
					ref={button => {
						this[item.name] = button
					}}
					onClick={() => {
						this.props.masterOnClick(item)
					}}>
					{Icon ? <Icon/> : item.name}
				</button>
				<span>{item.name}</span>
			</div>
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
					}}
					onClick={() => this.openMenu()}>
					{this.props.icon}
				</button>
				{this.props.dropOptions.map(item => {
						return this.renderItem(item)
					})}
			</div>
		)
	}
}

export default DropMenu
