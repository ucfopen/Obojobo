import './editor-nav.scss'
// relies on styles from viewer
import '../../viewer/components/nav.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import EditorUtil from '../util/editor-util'
import React from 'react'
import SubMenu from './sub-menu'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import generateAssessment from '../documents/generate-assessment'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

class EditorNav extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.navState

		this.showAddAssessmentModal = this.showAddAssessmentModal.bind(this)
		this.addAssessment = this.addAssessment.bind(this)
	}

	onNavItemClick(item) {
		EditorUtil.gotoPath(item.fullPath)
		this.setState({ navTargetId: item.id })
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

	showAddAssessmentModal() {
		ModalUtil.show(
			<Prompt
				title="Add Assessment"
				message="Enter the title for the new assessment:"
				onConfirm={this.addAssessment}
			/>
		)
	}

	addAssessment(name = 'Assessment') {
		ModalUtil.hide()

		const newAssessment = generateAssessment()
		newAssessment.content.title = this.isWhiteSpace(name) ? 'Assessment' : name
		EditorUtil.addAssessment(newAssessment)
		return this.setState({ navTargetId: newAssessment.id })
	}

	isWhiteSpace(str) {
		return !/[\S]/.test(str)
	}

	render() {
		const className =
			'visual-editor--draft-nav ' +
			isOrNot(this.state.locked, 'locked') +
			isOrNot(this.state.open, 'open') +
			isOrNot(!this.state.disabled, 'enabled')

		const list = EditorUtil.getOrderedList(this.props.navState)

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
									onClick={this.onNavItemClick.bind(this, item)}
								/>
							)
						}
						return null
					})}
				</ul>
				<button className={'content-add-button align-left'} onClick={this.showAddAssessmentModal}>
						+ Add Assessment
				</button>
			</div>
		)
	}
}

export default EditorNav
