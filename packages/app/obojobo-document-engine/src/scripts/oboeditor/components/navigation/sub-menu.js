import './sub-menu.scss'

import Common from 'Common'
import EditorUtil from '../../util/editor-util'
import React from 'react'
import MoreInfoBox from './more-info-box'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import generatePage from '../../documents/generate-page'
import generateId from '../../generate-ids'

import {
	getTriggersWithActionsAdded,
	getTriggersWithActionsRemoved,
	hasTriggerTypeWithActionType
} from 'obojobo-document-engine/src/scripts/common/util/trigger-util'

const { Prompt, SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util

const { OboModel } = Common.models

class SubMenu extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isFocused: false,
			currentFocus: 0
		}

		this.menu = []
		this.timeOutId = null

		this.showAddPageModal = this.showAddPageModal.bind(this)
		this.saveId = this.saveId.bind(this)
		this.saveContent = this.saveContent.bind(this)

		this.showDeleteModal = this.showDeleteModal.bind(this)
		this.deletePage = this.deletePage.bind(this)

		this.duplicatePage = this.duplicatePage.bind(this)
	}

	renamePage(pageId, label) {
		// Fix page titles that are whitespace strings
		if (!/[^\s]/.test(label)) label = null

		EditorUtil.renamePage(pageId, label)
	}

	movePage(pageId, index) {
		EditorUtil.movePage(pageId, index)
	}

	setStartPage(pageId) {
		EditorUtil.setStartPage(pageId)
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

	renderNewItemButton(pageId) {
		return (
			<div className="add-page">
				<button onClick={() => this.showAddPageModal(pageId)}>+ Page</button>
			</div>
		)
	}

	showAddPageModal(pageId) {
		ModalUtil.show(
			<Prompt
				title="Add Page"
				message="Enter the title for the new page:"
				onConfirm={this.addPage.bind(this, pageId)}
			/>
		)
	}

	addPage(afterPageId, title = null) {
		ModalUtil.hide()

		const newPage = generatePage()
		newPage.content.title = this.isWhiteSpace(title) ? null : title
		EditorUtil.addPage(newPage, afterPageId)
		this.setState({ navTargetId: newPage.id })
	}

	isWhiteSpace(str) {
		return !/[\S]/.test(str)
	}

	saveId(oldId, newId) {
		const model = OboModel.models[oldId]
		if (!model.setId(newId)) return 'The id "' + newId + '" already exists. Please choose a unique id'

		EditorUtil.rebuildMenu(OboModel.getRoot())

		this.setState({ navTargetId: newId })
	}

	saveContent(oldContent, newContent) {
		const item = this.props.list[this.props.index]
		const model = OboModel.models[item.id]

		model.set({ content: newContent })
		model.triggers = newContent.triggers ? newContent.triggers : []
		model.title =
			newContent.title || model.title ? this.renamePage(item.id, newContent.title) : null
	}

	showDeleteModal() {
		const item = this.props.list[this.props.index]

		ModalUtil.show(
			<SimpleDialog cancelOk onConfirm={this.deletePage}>
				{'Are you sure you want to delete ' +
					item.label +
					'? This will permanately delete all content in the page'}
			</SimpleDialog>
		)
	}

	deletePage() {
		ModalUtil.hide()
		const item = this.props.list[this.props.index]

		EditorUtil.deletePage(item.id)
	}

	duplicatePage() {
		const item = this.props.list[this.props.index]
		const model = OboModel.models[item.id]

		this.props.savePage()
		const newPage = model.flatJSON()
		newPage.children = model.get('children')
		// Removes duplicate ids from duplicated pages
		newPage.id = generateId()
		newPage.content.title = item.label + ' - (Copy)'
		EditorUtil.addPage(newPage, item.id)
	}

	render() {
		const { index, isSelected, list } = this.props
		const item = list[index]
		const isFirstInList = !list[index - 1]
		const isLastInList = !list[index + 1]

		const className =
			'editor--editor-nav--submenu link' +
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

		const model = OboModel.models[item.id]
		const contentDescription = [
			{
				name: 'title',
				description: 'Title',
				type: 'input'
			}
		]

		if (item.flags.assessment) {
			contentDescription.push(
				{
					name: 'attempts',
					description: 'Attempts',
					type: 'input'
				},
				{
					name: 'review',
					description: 'Review',
					type: 'select',
					values: [
						{
							value: 'always',
							description: 'Always show answers in review'
						},
						{
							value: 'never',
							description: 'Never show answers in review'
						},
						{
							value: 'no-attempts-remaining',
							description: 'Show answers in review after last attempt'
						}
					]
				},
				{
					name: 'lock-nav',
					description: 'Lock Navigation During Attempts',
					type: 'abstract-toggle',
					value: content => {
						const startAttemptLock = hasTriggerTypeWithActionType(content.triggers, 'onNavEnter', 'nav:lock')
						const endAttemptUnlock =
							hasTriggerTypeWithActionType(content.triggers, 'onEndAttempt', 'nav:unlock') &&
							hasTriggerTypeWithActionType(content.triggers, 'onNavExit', 'nav:unlock')

						return startAttemptLock && endAttemptUnlock
					},
					// onChange is called inside the MoreInfoBox, so prevState references previous the MoreInfoBox state
					onChange: (content, isNavLock) => {
						let triggers
						if (isNavLock) {
							triggers = getTriggersWithActionsAdded(content.triggers || [], {
								onNavEnter: { type: 'nav:lock' },
								onEndAttempt: { type: 'nav:unlock' },
								onNavExit: { type: 'nav:unlock' }
							})
						} else if (content.triggers) {
							triggers = getTriggersWithActionsRemoved(content.triggers, {
								onNavEnter: 'nav:lock',
								onEndAttempt: 'nav:unlock',
								onNavExit: 'nav:unlock'
							})
						}

						return { ...content, triggers }
					}
				}
			)
		}

		return (
			<li onClick={this.props.onClick} className={className}>
				{this.renderLinkButton(item.label, ariaLabel, item.id)}
				{isSelected ? (
					<MoreInfoBox
						id={item.id}
						type={model.get('type')}
						content={model.get('content')}
						saveId={this.saveId}
						saveContent={this.saveContent}
						savePage={this.props.savePage}
						contentDescription={contentDescription}
						deleteNode={this.showDeleteModal}
						duplicateNode={this.duplicatePage}
						markUnsaved={this.props.markUnsaved}/>
				) : null}
				{isSelected && !item.flags.assessment ? this.renderNewItemButton(item.id) : null}
			</li>
		)
	}
}

export default SubMenu
