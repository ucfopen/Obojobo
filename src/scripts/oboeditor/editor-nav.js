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
									value: label
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
		console.log(newPage)
		this.setState({navTargetId: newPage.id})
	}

	deletePage() {

	}

	/*
	postCurrentlyEditingDraft(draftContent) {
		var mime
		// try to parse JSON, if it works we assume we're sending JSON.
		// otherwise send as plain text in the hopes that it's XML
		try
		{
			JSON.parse(draftContent)
			mime = 'application/json'
		}
		catch(e)
		{
			mime = 'text/plain'
		}
		fetch('/api/drafts/' + editingDraftId, {
			method: 'POST',
			credentials: 'include',
			body: draftContent,
			headers: {
				'Accept': mime,
				'Content-Type': mime
			}
		})
		.then(function(res) {
			switch (res.status) {
				case 200:
					res.json().then(function(json) {
						if (json.value.id) alert('Saved! (' + json.value.id + ')')
						else {
							alert('Error: ' + error)
							console.error(error)
						}
					})
					break
				default:
					res.json().then(function(json) {
						alert('Error: ' + json.value.message + ' (' + res.status + ')')
					})
					.catch(function(e) {
						alert('Error: ' + res.statusText + ' (' + res.status + ')')
					})
					break
			}
		})
		.catch(function(error) {
			alert('Error: ' + error)
			console.error(error)
		})
	}
	*/

	saveDraft() {
		EditorUtil.startSaveDraft()

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

		console.log(contentJSON)
		json.children.push(contentJSON)

		const assessment = this.props.model.children.at(1) // deal with assessment
		const assessmentJSON = assessment.flatJSON()
		assessmentJSON.children =  assessment.get('children')

		console.log(assessmentJSON)
		json.children.push(assessmentJSON)


		EditorUtil.finishSaveDraft()
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
