import Common from 'Common'

import EditorUtil from '../util/editor-util'
import APIUtil from '../../viewer/util/api-util'

const { Store } = Common.flux
const { Dispatcher } = Common.flux
const { OboModel } = Common.models

class EditorStore extends Store {
	constructor() {
		let item
		let oldNavTargetId
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
					oldNavTargetId = this.state.navTargetId
					this.gotoItem(this.state.itemsById[payload.value.id])
				},
				'editor:gotoPath': payload => {
					oldNavTargetId = this.state.navTargetId
					this.gotoItem(this.state.itemsByPath[payload.value.path])
				},
				// @TODO may not need?
				/*
				'editor:setFlag': payload => {
					let navItem = this.state.itemsById[payload.value.id]
					navItem.flags[payload.value.flagName] = payload.value.flagValue
					this.triggerChange()
				},
				'editor:prev': () => {
					oldNavTargetId = this.state.navTargetId
					let prev = EditorUtil.getPrev(this.state)
					if (this.gotoItem(prev)) {
						APIUtil.postEvent(OboModel.getRoot(), 'editor:prev', '1.0.0', {
							from: oldNavTargetId,
							to: prev.id
						})
					}
				},
				'editor:next': () => {
					oldNavTargetId = this.state.navTargetId
					let next = EditorUtil.getNext(this.state)
					if (this.gotoItem(next)) {
						APIUtil.postEvent(OboModel.getRoot(), 'nav:next', '1.0.0', {
							from: oldNavTargetId,
							to: next.id
						})
					}
				},
				'editor:openExternalLink': payload => {
					window.open(payload.value.url)
					this.triggerChange()
				},
				'editor:showChildren': payload => {
					item = this.state.itemsById[payload.value.id]
					item.showChildren = true
					this.triggerChange()
				},
				'editor:hideChildren': payload => {
					item = this.state.itemsById[payload.value.id]
					item.showChildren = false
					this.triggerChange()
				},
				*/
			},
			this
		)
	}

	init(model, startingId, startingPath, viewState = {}) {
		this.state = {
			items: {},
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
			let first = EditorUtil.getFirst(this.state)

			if (first && first.id) EditorUtil.goto(first.id)
		}
	}

	buildMenu(model) {
		this.state.itemsById = {}
		this.state.itemsByPath = {}
		this.state.itemsByFullPath = {}
		this.state.items = this.generateNav(model)
	}

	gotoItem(navItem) {
		if (!navItem) {
			return false
		}

		if (this.state.navTargetId != null) {
			if (this.state.navTargetId === navItem.id) {
				return
			}

			let navTargetModel = EditorUtil.getNavTargetModel(this.state)
			if (navTargetModel && navTargetModel.processTrigger) {
				navTargetModel.processTrigger('onNavExit')
			}
			this.state.navTargetHistory.push(this.state.navTargetId)
			this.state.itemsById[this.state.navTargetId].showChildren = false
		}

		if (navItem.showChildrenOnNavigation) {
			navItem.showChildren = true
		}

		window.history.pushState({}, document.title, navItem.fullFlatPath)
		this.state.navTargetId = navItem.id
		const navModel = EditorUtil.getNavTargetModel(this.state)
		this.state.currentModel = navModel.attributes
		this.triggerChange()
		return true
	}

	generateNav(model, indent) {
		if (!model) return {}

		if (indent == null) {
			indent = ''
		}
		let item = Common.Store.getItemForType(model.get('type'))

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
			visited: false,
			complete: false,
			correct: false
		}

		for (let child of Array.from(model.children.models)) {
			let childNavItem = this.generateNav(child, indent + '_')
			navItem.children.push(childNavItem)
			childNavItem.fullPath = navItem.fullPath
				.concat(childNavItem.fullPath)
				.filter(item => item !== '')

			let flatPath = childNavItem.fullPath.join('/')
			childNavItem.flatPath = flatPath
			childNavItem.fullFlatPath = [
				'/editor',
				model.getRoot().get('draftId'),
				flatPath
			].join('/')
			this.state.itemsByPath[flatPath] = childNavItem
			this.state.itemsByFullPath[childNavItem.fullFlatPath] = childNavItem
		}

		this.state.itemsById[model.get('id')] = navItem

		return navItem
	}
}

let editorStore = new EditorStore()
window.__es = editorStore
export default editorStore
