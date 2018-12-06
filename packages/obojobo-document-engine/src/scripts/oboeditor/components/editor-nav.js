/* eslint no-alert: 0 */
import React from 'react'

import EditorUtil from '../util/editor-util'
import ClipboardUtil from '../util/clipboard-util'
import SubMenu from './sub-menu'
import generateId from '../generate-ids'
import isOrNot from '../../common/isornot'

import './editor-nav.scss'

import pageTemplate from '../documents/new-page.json'
import assessmentTemplate from '../documents/new-assessment.json'

class EditorNav extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.navState
	}

	onClick(item) {
		EditorUtil.gotoPath(item.fullPath)
		this.setState({ navTargetId: item.id })
	}

	addAssessment() {
		const label = window.prompt('Enter the title for the new Assessment:') || 'Assessment'

		const newAssessment = Object.assign({}, assessmentTemplate)
		newAssessment.id = generateId()
		newAssessment.content.title = label

		EditorUtil.addAssessment(newAssessment)
		this.setState({ navTargetId: newAssessment.id })
	}

	addPage() {
		const label = window.prompt('Enter the title for the new page:') || 'Default Page'

		const newPage = Object.assign({}, pageTemplate)
		newPage.id = generateId()
		newPage.content.title = label

		EditorUtil.addPage(newPage)
		this.setState({ navTargetId: newPage.id })
	}

	renameModule(module) {
		let label = window.prompt('Enter the new title:', module.label)

		// null means the user canceled without changing the value
		if (label === null) return

		// If the module name is empty or just whitespace, provide a default value
		if (!label || /\s/.test(label)) label = '(Unnamed Module)'

		EditorUtil.renamePage(module.id, label)
	}

	renderLabel(label) {
		return <span>{label}</span>
	}

	renderHeading(index, item) {
		return (
			<li key={index} className={'heading is-not-selected'}>
				{this.renderLabel(item.label)}
			</li>
		)
	}

	render() {
		const className =
			'viewer--components--nav ' +
			'editor--components--nav ' +
			isOrNot(this.state.locked, 'locked') +
			isOrNot(this.state.open, 'open') +
			isOrNot(!this.state.disabled, 'enabled')

		const list = EditorUtil.getOrderedList(this.props.navState)

		const url = window.location.origin + '/view/' + this.props.draftId
		const moduleItem = list[0]

		return (
			<div className={className}>
				<ul>
					{list.map((item, index) => {
						if (item.type === 'heading') return this.renderHeading(index, item)
						if (item.type === 'link') {
							return (
								<SubMenu
									key={index}
									index={index}
									isSelected={this.state.navTargetId === item.id}
									list={list}
									onClick={this.onClick.bind(this, item)}
								/>
							)
						}
						return null
					})}
				</ul>
				<div className="button-bar">
					<button className={'content-add-button'} onClick={() => this.addPage()}>
						+ Add Page
					</button>
					<button className={'content-add-button'} onClick={() => this.addAssessment()}>
						+ Add Assessment
					</button>
					<br />
					<button className={'content-add-button'} onClick={() => this.renameModule(moduleItem)}>
						Rename Module
					</button>
					<button
						className={'content-add-button'}
						onClick={() => ClipboardUtil.copyToClipboard(url)}
					>
						Copy Module URL
					</button>
				</div>
			</div>
		)
	}
}

export default EditorNav
