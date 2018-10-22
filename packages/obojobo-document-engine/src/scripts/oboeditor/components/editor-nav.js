/* eslint no-alert: 0 */

import React from 'react'
import Common from 'Common'

import EditorUtil from '../util/editor-util'
import generateId from '../generate-ids'

import './editor-nav.scss'

import pageTemplate from '../documents/new-page.json'
import assessmentTemplate from '../documents/new-assessment.json'

const { OboModel } = Common.models

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

	copyToClipboard(str) {
		// Loads the url into an invisible textarea
		// to copy it to the clipboard
		const el = document.createElement('textarea')
		el.value = str
		el.setAttribute('readonly', '')
		el.style.position = 'absolute'
		el.style.left = '-9999px'
		document.body.appendChild(el)
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)
		window.alert('Copied ' + str + ' to the clipboard')
	}

	renderLabel(label) {
		return <a>{label}</a>
	}

	renderDropDown(item) {
		const model = OboModel.models[item.id]
		return (
			<div className={'dropdown'}>
				<span className={'drop-arrow'}>▼</span>
				<div className={'drop-content'}>
					{model.isFirst() ? null : (
						<button onClick={() => this.movePage(item.id, model.getIndex() - 1)}>Move Up</button>
					)}
					{model.isLast() ? null : (
						<button onClick={() => this.movePage(item.id, model.getIndex() + 1)}>Move Down</button>
					)}
					<button onClick={() => this.renamePage(item.id)}>Edit Name</button>
					<button onClick={() => this.deletePage(item.id)}>Delete</button>
					<button onClick={() => this.copyToClipboard(item.id)}>{'Id: ' + item.id}</button>
				</div>
			</div>
		)
	}

	renderLink(index, isSelected, list) {
		const item = list[index]
		const isFirstInList = !list[index - 1]
		const isLastInList = !list[index + 1]

		const className =
			'link' +
			isOrNot(isSelected, 'selected') +
			isOrNot(item.flags.assessment, 'assessment') +
			isOrNot(isFirstInList, 'first-in-list') +
			isOrNot(isLastInList, 'last-in-list')

		return (
			<li key={index} onClick={this.onClick.bind(this, item)} className={className}>
				{this.renderLabel(item.label)}
				{this.renderDropDown(item)}
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
							return this.renderLink(index, this.state.navTargetId === item.id, list)
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
					<button className={'content-add-button'} onClick={() => this.renamePage(moduleItem.id)}>
						Rename Module
					</button>
					<button className={'content-add-button'} onClick={() => this.copyToClipboard(url)}>
						Copy Module URL
					</button>
				</div>
			</div>
		)
	}
}

const isOrNot = (item, text) => {
	if (item) return ' is-' + text
	return ' is-not-' + text
}

export default EditorNav
