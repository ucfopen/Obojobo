import React from 'react'
import Common from 'Common'

import EditorUtil from '../util/editor-util'
import ClipboardUtil from '../util/clipboard-util'
import SubMenu from './sub-menu'
import generateId from '../generate-ids'
import isOrNot from '../../common/isornot'

import './editor-nav.scss'

import pageTemplate from '../documents/new-page.json'
import assessmentTemplate from '../documents/new-assessment.json'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

class EditorNav extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.navState
	}

	onClick(item) {
		EditorUtil.gotoPath(item.fullPath)
		this.setState({ navTargetId: item.id })
	}

	showAddAssessmentModal() {
		ModalUtil.show(
			<Prompt
				title="Add Assessment"
				message="Enter the title for the new assessment:"
				onConfirm={this.addAssessment.bind(this)}
			/>
		)
	}

	addAssessment(name = 'Assessment') {
		ModalUtil.hide()

		// Fix assessment titles that are whitespace strings
		if (!/[^\s]/.test(name)) name = 'Assessment'

		const newAssessment = Object.assign({}, assessmentTemplate)
		newAssessment.id = generateId()
		newAssessment.content.title = name

		EditorUtil.addAssessment(newAssessment)
		return this.setState({ navTargetId: newAssessment.id })
	}

	showAddPageModal() {
		ModalUtil.show(
			<Prompt
				title="Add Page"
				message="Enter the title for the new page:"
				onConfirm={this.addPage.bind(this)}
			/>
		)
	}

	addPage(title = null) {
		ModalUtil.hide()

		const newPage = Object.assign({}, pageTemplate)
		newPage.id = generateId()

		// Fix page titles that are whitespace strings
		if (!/[^\s]/.test(title)) title = null

		newPage.content.title = title

		EditorUtil.addPage(newPage)
		this.setState({ navTargetId: newPage.id })
	}

	showRenameModuleModal(module) {
		ModalUtil.show(
			<Prompt
				title="Rename Module"
				message="Enter the new title for the module:"
				value={module.label}
				onConfirm={this.renameModule.bind(this, module.id)}
			/>
		)
	}

	renameModule(moduleId, label) {
		ModalUtil.hide()

		// If the module name is empty or just whitespace, provide a default value
		if (!label || !/[^\s]/.test(label)) label = '(Unnamed Module)'

		EditorUtil.renamePage(moduleId, label)
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
					<button className={'content-add-button'} onClick={this.showAddPageModal.bind(this)}>
						+ Add Page
					</button>
					<button className={'content-add-button'} onClick={this.showAddAssessmentModal.bind(this)}>
						+ Add Assessment
					</button>
					<br />
					<button
						className={'content-add-button'}
						onClick={this.showRenameModuleModal.bind(this, moduleItem)}
					>
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
