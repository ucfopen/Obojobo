import React from 'react'

import EditorUtil from './util/editor-util'
import generateId from './generate-ids'

class EditorNav extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.navState
	}

	onClick(item) {
		EditorUtil.gotoPath(item.fullPath)
	}

	addPage() {
		const label = window.prompt('Enter the title for the new page:')
			|| ('Page '+this.state.list.length)

		const newPage = {
			type: 'link',
			label,
			id: generateId(),
			flags: {}
		}

		this.state.list.push(newPage)
		console.log(newPage)
		this.setState({navTargetId: newPage.id})
	}

	renderLabel(label) {
		return <a>{label}</a>
	}

	renderLink(index, isSelected, list) {
		let item = list[index]
		let isFirstInList = !list[index - 1]
		let isLastInList = !list[index + 1]

		let className =
			'link' +
			isOrNot(isSelected, 'selected') +
			isOrNot(isFirstInList, 'first-in-list') +
			isOrNot(isLastInList, 'last-in-list')

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLabel(item.label)}
			</li>
		)
	}

	renderHeading(index, item) {
		return (
			<li key={index} className={'heading is-not-selected'}>
				{this.renderLabel(item.label)}
			</li>
		)
	}

	render() {
		let className =
			'viewer--components--nav' +
			isOrNot(this.state.locked, 'locked') +
			isOrNot(this.state.open, 'open') +
			isOrNot(!this.state.disabled, 'enabled')

		let list = EditorUtil.getOrderedList(this.props.navState)

		return (
			<div className={className}>
				<button className="toggle-button" >
					Toggle Navigation Menu
				</button>
				<ul>
					{list.map((item, index) => {
						switch (item.type) {
							case 'heading':
								return this.renderHeading(index, item)
							case 'link':
								return this.renderLink(index, this.state.navTargetId === item.id, list)
						}
					})}
				</ul>
				<button onClick={() => this.addPage()}>{'Add Page'}</button>
			</div>
		)
	}
}

const isOrNot = (item, text) => {
	if(item) return ' is-'+text
	return ' is-not-'+text
}

export default EditorNav
