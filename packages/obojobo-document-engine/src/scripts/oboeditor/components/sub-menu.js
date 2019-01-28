/* eslint no-alert: 0 */
import React from 'react'
import Common from 'Common'
import EditorUtil from '../util/editor-util'
import ClipboardUtil from '../util/clipboard-util'
import isOrNot from '../../common/isornot'

import './sub-menu.scss'

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

	deletePage(pageId) {
		EditorUtil.deletePage(pageId)
	}

	renamePage(pageId) {
		const label = window.prompt('Enter the new title:') || pageId
		EditorUtil.renamePage(pageId, label)
	}

	movePage(pageId, index) {
		EditorUtil.movePage(pageId, index)
	}

	componentDidUpdate() {
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
		if (event.key === 'ArrowLeft') {
			this.setState({ isOpen: false })
			this.linkButton.focus()
		}

		// Move down through the submenu
		if (event.key === 'ArrowDown') {
			this.setState(currentState => ({
				currentFocus: (currentState.currentFocus + 1) % this.menu.length
			}))
		}

		// Move up through the submenu
		if (event.key === 'ArrowUp') {
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

	renderLabel(label) {
		return <span>{label}</span>
	}

	renderLinkButton(label, ariaLabel, refId) {
		return (
			<button
				ref={item => {
					this.linkButton = item
					return refId
				}}
				aria-label={ariaLabel}
			>
				{this.renderLabel(label)}
			</button>
		)
	}

	renderDropDown(item) {
		this.menu = []
		const model = OboModel.models[item.id]
		return (
			<ul className={'dropdown ' + isOrNot(this.state.isOpen, 'open')}>
				<span>{'▼'}</span>
				{model.isFirst() ? null : (
					<li>
						<button
							onClick={() => this.movePage(item.id, model.getIndex() - 1)}
							tabIndex="-1"
							ref={item => {
								this.moveUp = item
							}}
						>
							Move Up
						</button>
					</li>
				)}
				{model.isLast() ? null : (
					<li>
						<button
							onClick={() => this.movePage(item.id, model.getIndex() + 1)}
							tabIndex="-1"
							ref={item => {
								this.moveDown = item
							}}
						>
							Move Down
						</button>
					</li>
				)}
				<li>
					<button
						onClick={() => this.renamePage(item.id)}
						tabIndex="-1"
						ref={item => {
							this.editName = item
						}}
					>
						Edit Name
					</button>
				</li>
				<li>
					<button
						onClick={() => this.deletePage(item.id)}
						tabIndex="-1"
						ref={item => {
							this.delete = item
						}}
					>
						Delete
					</button>
				</li>
				<li>
					<button
						onClick={() => ClipboardUtil.copyToClipboard(item.id)}
						tabIndex="-1"
						ref={item => {
							this.getId = item
						}}
					>
						{'Id: ' + item.id}
					</button>
				</li>
			</ul>
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
		const { index, isSelected, list } = this.props
		const item = list[index]
		const isFirstInList = !list[index - 1]
		const isLastInList = !list[index + 1]

		const className =
			'link' +
			isOrNot(isSelected, 'selected') +
			isOrNot(item.flags.assessment, 'assessment') +
			isOrNot(isFirstInList, 'first-in-list') +
			isOrNot(isLastInList, 'last-in-list')

		let ariaLabel = item.label
		if (item.contentType) {
			ariaLabel = item.contentType + ': ' + ariaLabel
		}
		if (isSelected) {
			ariaLabel = 'Currently on ' + ariaLabel
		} else {
			ariaLabel = 'Go to ' + ariaLabel
		}

		return (
			<li
				onClick={this.props.onClick}
				className={className}
				onBlur={() => this.onBlurHandler()}
				onFocus={() => this.onFocusHandler()}
				onKeyDown={event => this.onKeyDown(event)}
			>
				{this.renderLinkButton(item.label, ariaLabel, item.id)}
				{this.renderDropDown(item)}
				{this.linkReferences()}
			</li>
		)
	}
}

export default SubMenu
