import React from 'react'

import EditorUtil from '../util/editor-util'
import APIUtil from '../../viewer/util/api-util'
import generateId from '../generate-ids'

import './editor-nav.scss'

class EditorNav extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.navState
	}

	onClick(item) {
		EditorUtil.gotoPath(item.fullPath)
		this.setState({ navTargetId: item.id })
	}

	addPage() {
		const label = window.prompt('Enter the title for the new page:')
			|| ('Default Page')

		const newPage = {
			id: generateId(),
			type: "ObojoboDraft.Pages.Page",
			content: {
				title: label
			},
			children: [
				{
					type: "ObojoboDraft.Chunks.Heading",
					content: {
						headingLevel: 1,
						textGroup: [
							{
								text: {
									value: "Add a Title Here"
								}
							}
						]
					},
					"children": []
				},
				{
					type: "ObojoboDraft.Chunks.Text",
					content: {
						textGroup: [
							{
								text: {
									value:
										"Add some content here"
								},
							}
						]
					},
					"children": []
				}
			]
		}

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

	moveUpPage(pageId) {
		console.log('clicked')
		EditorUtil.moveUpPage(pageId)
	}

	saveDraft() {
		const json = this.props.model.flatJSON()

		// deal with content
		const content = this.props.model.children.at(0)
		const contentJSON = content.flatJSON()
		for(let child of Array.from(content.children.models)){
			contentJSON.children.push({
				id: child.get('id'),
				type: child.get('type'),
				content: child.get('content'),
				children: child.get('children')
			})
		}

		json.children.push(contentJSON)

		const assessment = this.props.model.children.at(1) // deal with assessment
		const assessmentJSON = assessment.flatJSON()
		assessmentJSON.children =  assessment.get('children')

		json.children.push(assessmentJSON)

		APIUtil.postDraft(this.props.draftId, json).then(result => {
			console.log(result)
		})
	}

	renderLabel(label) {
		return <a>{label}</a>
	}

	renderDropDown(item) {
		return (
			<div className={'dropdown'}>
				<span className={'drop-arrow'}>▼</span>
				<div className={'drop-content'}>
					<button onClick={() => this.moveUpPage(item.id)}>Move Up</button>
					<button onClick={() => this.renamePage(item.id)}>Edit Name</button>
					<button onClick={() => this.deletePage(item.id)}>Delete</button>
					<button>{'Id: '+ item.id}</button>
				</div>
			</div>
		)
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
				<button onClick={() => this.saveDraft()}>{'Save Draft'}</button>
			</div>
		)
	}
}

const isOrNot = (item, text) => {
	if(item) return ' is-'+text
	return ' is-not-'+text
}

export default EditorNav
