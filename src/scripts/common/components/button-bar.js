import './button-bar.scss'

import React from 'react'
import Button from './button'

export default class ButtonBar extends React.Component {
	constructor(props) {
		super()

		this.boundBack = this.back.bind(this)
		this.boundNext = this.next.bind(this)

		this.state = {
			end: null
		}
	}

	get maxItems() {
		if (!this.props.maxItems) return this.props.children.length
		return this.props.children.length <= this.props.maxItems
			? this.props.children.length
			: this.props.maxItems - 2
	}

	get start() {
		return this.end - this.maxItems
	}

	get end() {
		return this.state.end !== null ? this.state.end : this.props.children.length
	}

	onClickButton(index, isSelected, originalOnClick, buttonBarOnClick = () => {}) {
		if (typeof originalOnClick === 'function') {
			originalOnClick()
		}

		buttonBarOnClick(index, isSelected)
	}

	get prevNonDisabledButtonIndex() {
		for (let i = this.props.selectedIndex - 1; i >= 0; i--) {
			const child = this.props.children[i]
			if (!child.props.disabled) return i
		}

		return null
	}

	get nextNonDisabledButtonIndex() {
		for (let i = this.props.selectedIndex + 1, len = this.props.children.length; i < len; i++) {
			const child = this.props.children[i]
			if (!child.props.disabled) return i
		}

		return null
	}

	get canGoBack() {
		return this.prevNonDisabledButtonIndex !== null
	}

	get canGoForward() {
		return this.nextNonDisabledButtonIndex !== null
	}

	back() {
		if (!this.canGoBack) return
		const prevIndex = this.prevNonDisabledButtonIndex

		this.props.onChangeSelectedItem(prevIndex, false)

		if (prevIndex < this.start) {
			this.setState({
				end: this.maxItems + prevIndex
			})
		}
	}

	next() {
		if (!this.canGoForward) return
		const nextIndex = this.nextNonDisabledButtonIndex

		this.props.onChangeSelectedItem(nextIndex, false)

		if (nextIndex >= this.end) {
			this.setState({
				end: nextIndex + 1
			})
		}
	}

	render() {
		const end = this.end
		const maxItems = this.maxItems

		const start = this.start
		const children = this.props.children

		const backButton = false
		const nextButton = false
		// let slice

		const isNavButtonNeeded = maxItems < children.length
		const slice = children.slice(start, end)

		// if (maxItems >= children.length) {
		// 	console.log(1)
		// 	slice = children
		// } else if (end >= children.length - 1) {
		// 	console.log(2)
		// 	backButton = true
		// 	slice = children.slice(end - maxItems + 1, end)
		// } else if (end - maxItems <= 0) {
		// 	console.log(3)
		// 	nextButton = true
		// 	slice = children.slice(0, maxItems - 1)
		// } else {
		// 	console.log(4)
		// 	backButton = nextButton = true
		// 	console.log('slice', end - maxItems + 2, end)
		// 	slice = children.slice(end - maxItems + 2, end)
		// }

		console.log('end', end, 'maxItems', maxItems, 'slice', slice)

		const navProps = {}
		if (this.props.altAction) navProps.altAction = this.props.altAction
		if (this.props.isDangerous) navProps.isDangerous = this.props.isDangerous
		if (this.props.disabled) navProps.disabled = this.props.disabled

		return (
			<div className={`obojobo-draft--components--button-bar`}>
				{isNavButtonNeeded ? (
					<div key="_prev" className="prev">
						<Button
							{...navProps}
							disabled={!this.canGoBack ? true : this.props.disabled}
							onClick={this.boundBack}
						>
							▶
						</Button>
					</div>
				) : null}
				{slice.map((child, i) => {
					const isSelected = i + start === this.props.selectedIndex
					const childProps = Object.assign({}, child.props)

					if (this.props.altAction) {
						childProps.altAction = this.props.altAction
					}

					if (this.props.isDangerous) {
						childProps.isDangerous = this.props.isDangerous
					}

					if (this.props.disabled) {
						childProps.disabled = this.props.disabled
					}

					childProps.onClick = this.onClickButton.bind(
						null,
						i + start,
						isSelected,
						childProps.onClick || (() => {}),
						this.props.onChangeSelectedItem
					)

					return (
						<div key={i} className={isSelected ? 'is-selected' : ''}>
							<Button {...childProps}>{child.props.children}</Button>
						</div>
					)
				})}
				{isNavButtonNeeded ? (
					<div key="_next" className="next">
						<Button
							{...navProps}
							disabled={!this.canGoForward ? true : this.props.disabled}
							onClick={this.boundNext}
						>
							▶
						</Button>
					</div>
				) : null}
			</div>
		)
	}
}
