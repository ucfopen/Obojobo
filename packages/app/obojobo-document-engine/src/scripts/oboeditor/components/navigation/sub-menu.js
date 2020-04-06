import './sub-menu.scss'

import Common from '../../../common'
import EditorUtil from '../../util/editor-util'
import React from 'react'
import MoreInfoBox from './more-info-box'
import isOrNot from '../../../common/util/isornot'
import generatePage from '../../documents/generate-page'

import {
	getTriggersWithActionsAdded,
	getTriggersWithActionsRemoved,
	hasTriggerTypeWithActionType
} from '../../../common/util/trigger-util'

const { Prompt, Dialog } = Common.components.modal
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
		return label
	}

	movePage(pageId, index) {
		EditorUtil.movePage(pageId, index)
	}

	renderNewItemButton(pageId) {
		return (
			<div className="add-page">
				<button className="add-page-button" onClick={() => this.showAddPageModal(pageId)}>
					+ Page
				</button>
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
	}

	isWhiteSpace(str) {
		return !/[\S]/.test(str)
	}

	saveId(oldId, newId) {
		const model = OboModel.models[oldId]

		if (!newId) {
			return 'Please enter an id'
		}

		if (!model.setId(newId)) {
			return 'The id "' + newId + '" already exists. Please choose a unique id'
		}

		EditorUtil.rebuildMenu(OboModel.getRoot())
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
			<Dialog
				centered
				buttons={[
					{
						value: 'Cancel',
						altAction: true,
						onClick: ModalUtil.hide
					},
					{
						value: 'Yes, Delete',
						onClick: this.deletePage,
						default: true,
						isDangerous: true
					}
				]}
				title={'Delete ' + item.label}
			>
				{'Are you sure you want to delete ' +
					item.label +
					'? This will permanently delete all content in the page'}
			</Dialog>
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
		const clonedPage = model.clone(true).toJSON()
		// Make a shallow copy of the content, to prevent problems with two pages sharing the same content
		clonedPage.content = Object.assign({}, model.get('content'))
		clonedPage.content.title = item.label + ' - (Copy)'
		EditorUtil.addPage(clonedPage, item.id)
	}

	lockValue(content) {
		const startAttemptLock = hasTriggerTypeWithActionType(
			content.triggers,
			'onNavEnter',
			'nav:lock'
		)
		const endAttemptUnlock =
			hasTriggerTypeWithActionType(content.triggers, 'onEndAttempt', 'nav:unlock') &&
			hasTriggerTypeWithActionType(content.triggers, 'onNavExit', 'nav:unlock')

		return startAttemptLock && endAttemptUnlock
	}

	onChangeLock(content, isNavLock) {
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
					value: this.lockValue,
					onChange: this.onChangeLock
				}
			)
		}

		return (
			<li onClick={this.props.onClick} className={className}>
				<button aria-label={ariaLabel}>
					<span>{item.label}</span>
				</button>

				{isSelected ? (
					<MoreInfoBox
						id={item.id}
						index={model.getIndex()}
						isFirst={model.isFirst()}
						isLast={model.isLast()}
						type={model.get('type')}
						content={model.get('content')}
						saveId={this.saveId}
						saveContent={this.saveContent}
						savePage={this.props.savePage}
						contentDescription={contentDescription}
						deleteNode={this.showDeleteModal}
						duplicateNode={this.duplicatePage}
						markUnsaved={this.props.markUnsaved}
						moveNode={this.movePage.bind(this, item.id)}
						showMoveButtons
					/>
				) : null}
				{isSelected && !item.flags.assessment ? this.renderNewItemButton(item.id) : null}
			</li>
		)
	}
}

export default SubMenu
