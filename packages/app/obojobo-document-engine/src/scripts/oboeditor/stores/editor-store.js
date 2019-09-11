/* eslint eqeqeq: 0 */

import Common from 'Common'
import EditorUtil from '../util/editor-util'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models

const MODULE_NODE = 'ObojoboDraft.Modules.Module'
const CONTENT_NODE = 'ObojoboDraft.Sections.Content'

class EditorStore extends Store {
	constructor() {
		super('editorstore')

		Dispatcher.on(
			{
				'editor:setContext': payload => {
					this.state.context = payload.value.context
					return this.triggerChange()
				},
				'editor:rebuildMenu': payload => {
					this.buildMenu(payload.value.model)
					this.triggerChange()
				},
				'editor:goto': payload => {
					this.gotoItem(this.state.itemsById[payload.value.id])
				},
				'editor:gotoPath': payload => {
					this.gotoItem(this.state.itemsByPath[payload.value.path])
				},
				'editor:addPage': payload => {
					this.addPage(payload.value.newPage, payload.value.afterPageId)
				},
				'editor:addAssessment': payload => {
					this.addAssessment(payload.value.newAssessment)
				},
				'editor:deletePage': payload => {
					this.deletePage(payload.value.pageId)
				},
				'editor:movePage': payload => {
					this.movePage(payload.value.pageId, payload.value.index)
				},
				'editor:renamePage': payload => {
					this.renamePage(payload.value.pageId, payload.value.name)
				},
				'editor:setStartPage': payload => {
					this.setStartPage(payload.value.pageId)
				}
			},
			this
		)
	}

	init(model, startingId = null, settings, startingPath, viewState = {}) {
		this.state = {
			navItems: {},
			itemsById: {},
			itemsByPath: {},
			itemsByFullPath: {},
			navTargetHistory: [],
			navTargetId: null,
			locked: viewState['nav:isLocked'] != null ? viewState['nav:isLocked'].value : false,
			open: viewState['nav:isOpen'] != null ? viewState['nav:isOpen'].value : true,
			context: 'editor',
			currentPageModel: null,
			settings,
			startingId
		}

		this.buildMenu(model)
		EditorUtil.gotoPath(startingPath)

		if (startingId != null) {
			EditorUtil.goto(startingId)
		} else {
			const first = EditorUtil.getFirst(this.state)

			if (first && first.id) EditorUtil.goto(first.id)
		}
	}

	buildMenu(model) {
		this.state.itemsById = {}
		this.state.itemsByPath = {}
		this.state.itemsByFullPath = {}
		this.state.navItems = this.generateNav(model)
	}

	gotoItem(navItem) {
		if (!navItem) {
			return false
		}

		if (this.state.navTargetId != null) {
			if (this.state.navTargetId === navItem.id) {
				return
			}

			const navTargetModel = EditorUtil.getNavTargetModel(this.state)
			if (navTargetModel && navTargetModel.processTrigger) {
				navTargetModel.processTrigger('onNavExit')
			}
			this.state.navTargetHistory.push(this.state.navTargetId)
		}

		if (navItem.showChildrenOnNavigation) {
			navItem.showChildren = true
		}

		window.history.pushState({}, document.title, navItem.fullFlatPath)
		this.state.navTargetId = navItem.id
		const navModel = EditorUtil.getNavTargetModel(this.state)
		this.state.currentPageModel = navModel
		this.triggerChange()
		return true
	}

	generateNav(model, indent) {
		if (!model) return {}

		if (indent == null) {
			indent = ''
		}
		const item = Common.Registry.getItemForType(model.get('type'))

		let navItem = null
		if (item.getNavItem != null) {
			navItem = item.getNavItem(model)
		}

		if (navItem == null) {
			navItem = {}
		}

		navItem = Object.assign(
			{
				type: 'hidden',
				label: '',
				path: '',
				showChildren: true,
				showChildrenOnNavigation: true
			},
			navItem
		)

		navItem.flags = []
		navItem.children = []
		navItem.id = model.get('id')
		navItem.fullPath = [].concat(navItem.path).filter(item => item !== '')
		navItem.flags = {
			complete: false,
			correct: false
		}

		for (const child of Array.from(model.children.models)) {
			const childNavItem = this.generateNav(child, indent + '_')
			navItem.children.push(childNavItem)
			childNavItem.fullPath = navItem.fullPath
				.concat(childNavItem.fullPath)
				.filter(item => item !== '')

			const flatPath = childNavItem.fullPath.join('/')
			childNavItem.flatPath = flatPath
			childNavItem.fullFlatPath = ['/editor', model.getRoot().get('draftId'), flatPath].join('/')
			this.state.itemsByPath[flatPath] = childNavItem
			this.state.itemsByFullPath[childNavItem.fullFlatPath] = childNavItem
		}

		this.state.itemsById[model.get('id')] = navItem

		return navItem
	}

	addPage(newPage, afterPageId) {
		const rootModel = OboModel.getRoot()
		let newPageModel

		if(afterPageId) {
			const pageModel = OboModel.models[afterPageId]
			newPageModel = OboModel.create(newPage)
			pageModel.addChildAfter(newPageModel)
		} else {
			// Add the newPage to the end of the content
			newPageModel = OboModel.create(newPage)
			rootModel.children.forEach(child => {
				if (child.get('type') === CONTENT_NODE) {
					child.children.add(newPageModel)
				}
			})
		}

		EditorUtil.rebuildMenu(rootModel)
		EditorUtil.goto(newPageModel.id)
	}

	addAssessment(newAssessment) {
		const rootModel = OboModel.getRoot()

		// Add the newPage to the content
		const assessmentModel = OboModel.create(newAssessment)
		rootModel.children.add(assessmentModel)

		EditorUtil.rebuildMenu(rootModel)
		EditorUtil.goto(assessmentModel.id)
	}

	deletePage(pageId) {
		const pageModel = OboModel.models[pageId]
		const parentModule = pageModel.getParentOfType(MODULE_NODE)

		pageModel.remove()
		EditorUtil.rebuildMenu(parentModule)

		this.state.currentPageModel = null
		this.triggerChange()

		const first = EditorUtil.getFirst(this.state)
		if (first && first.id) EditorUtil.goto(first.id)
	}

	renamePage(pageId, newName) {
		const pageModel = OboModel.models[pageId]
		pageModel.set('content', { title: newName })
		pageModel.title = newName

		EditorUtil.rebuildMenu(OboModel.getRoot())
		this.triggerChange()
	}

	setStartPage(pageId) {
		this.state.startingId = pageId
		this.triggerChange()
	}

	movePage(pageId, index) {
		const pageModel = OboModel.models[pageId]
		pageModel.moveTo(index)

		EditorUtil.rebuildMenu(OboModel.getRoot())
		this.triggerChange()
	}
}

const editorStore = new EditorStore()
window.__es = editorStore
export default editorStore
