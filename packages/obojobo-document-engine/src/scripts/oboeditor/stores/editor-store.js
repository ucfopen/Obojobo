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
					this.addPage(payload.value.newPage)
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
				}
			},
			this
		)
	}

	init(model, startingId, startingPath, viewState = {}) {
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
			currentModel: null
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
		this.state.currentModel = navModel
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

	addPage(newPage) {
		const model = OboModel.getRoot()

		// Add the newPage to the content
		const pageModel = OboModel.create(newPage)
		model.children.forEach(child => {
			if (child.get('type') === CONTENT_NODE) {
				child.children.add(pageModel)
			}
		})

		EditorUtil.rebuildMenu(model)
		EditorUtil.goto(pageModel.id)
	}

	addAssessment(newAssessment) {
		const model = OboModel.getRoot()

		// Add the newPage to the content
		const assessmentModel = OboModel.create(newAssessment)
		model.children.add(assessmentModel)

		EditorUtil.rebuildMenu(model)
		EditorUtil.goto(assessmentModel.id)
	}

	deletePage(pageId) {
		const model = this.state.currentModel.getParentOfType(MODULE_NODE)

		OboModel.models[pageId].remove()

		EditorUtil.rebuildMenu(model)

		this.state.currentModel = null
		this.triggerChange()
	}

	renamePage(pageId, newName) {
		OboModel.models[pageId].set('content', { title: newName })
		OboModel.models[pageId].title = newName

		EditorUtil.rebuildMenu(OboModel.getRoot())
		this.triggerChange()
	}

	movePage(pageId, index) {
		const model = OboModel.models[pageId]
		model.moveTo(index)

		EditorUtil.rebuildMenu(OboModel.getRoot())
		this.triggerChange()
	}
}

const editorStore = new EditorStore()
window.__es = editorStore
export default editorStore
