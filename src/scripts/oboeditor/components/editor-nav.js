import React from 'react'
import Common from 'Common'

import EditorUtil from '../util/editor-util'
import APIUtil from '../../viewer/util/api-util'
import NavItem from './nav-item'
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
		const label = window.prompt('Enter the title for the new Assessment:')
			|| ('Assessment')

		const newAssessment = Object.assign({}, assessmentTemplate)
		newAssessment.id = generateId()
		newAssessment.content.title = label

		EditorUtil.addAssessment(newAssessment)
		this.setState({ navTargetId: newAssessment.id })
	}

	addPage() {
		const label = window.prompt('Enter the title for the new page:')
			|| ('Default Page')

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
		const label = window.prompt('Enter the title for the new page:')
			|| (pageId)
		EditorUtil.renamePage(pageId, label)
	}

	movePage(pageId, index) {
		EditorUtil.movePage(pageId, index)
	}

	renderLabel(label) {
		return label
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
								return (
									<NavItem
										key={item.id}
										index={index}
										isSelected={this.state.navTargetId === item.id}
										list={list}
										onClick={this.onClick}
								/>)
						}
					})}
				</ul>
				<button className={'nav-modify'} onClick={() => this.addPage()}>{'+ Add Page'}</button>
				<button className={'nav-modify'} onClick={() => this.addAssessment()}>{'+ Add Assessment'}</button>
			</div>
		)
	}
}

const isOrNot = (item, text) => {
	if(item) return ' is-'+text
	return ' is-not-'+text
}

export default EditorNav
