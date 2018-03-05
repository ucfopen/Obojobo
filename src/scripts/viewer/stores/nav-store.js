import Common from 'Common'

import NavUtil from '../../viewer/util/nav-util'
import APIUtil from '../../viewer/util/api-util'

let { Store } = Common.flux
let { Dispatcher } = Common.flux
let { OboModel } = Common.models

class NavStore extends Store {
	constructor() {
		let item, oldNavTargetId
		super('navstore')

		Dispatcher.on(
			{
				'nav:setContext': payload => {
					this.state.context = payload.value.context
					return this.triggerChange()
				},
				'nav:rebuildMenu': payload => {
					this.buildMenu(payload.value.model)
					return this.triggerChange()
				},
				'nav:gotoPath': payload => {
					oldNavTargetId = this.state.navTargetId
					if (this.gotoItem(this.state.itemsByPath[payload.value.path])) {
						return APIUtil.postEvent(OboModel.getRoot(), 'nav:gotoPath', '1.0.0', {
							from: oldNavTargetId,
							to: this.state.itemsByPath[payload.value.path].id
						})
					}
				},
				'nav:setFlag'(payload) {
					let navItem = this.state.itemsById[payload.value.id]
					navItem.flags[payload.value.flagName] = payload.value.flagValue

					return this.triggerChange()
				},
				'nav:prev': payload => {
					oldNavTargetId = this.state.navTargetId
					let prev = NavUtil.getPrev(this.state)
					if (this.gotoItem(prev)) {
						return APIUtil.postEvent(OboModel.getRoot(), 'nav:prev', '1.0.0', {
							from: oldNavTargetId,
							to: prev.id
						})
					}
				},
				'nav:next': payload => {
					oldNavTargetId = this.state.navTargetId
					let next = NavUtil.getNext(this.state)
					if (this.gotoItem(next)) {
						return APIUtil.postEvent(OboModel.getRoot(), 'nav:next', '1.0.0', {
							from: oldNavTargetId,
							to: next.id
						})
					}
				},
				'nav:goto': payload => {
					oldNavTargetId = this.state.navTargetId
					if (this.gotoItem(this.state.itemsById[payload.value.id])) {
						return APIUtil.postEvent(OboModel.getRoot(), 'nav:goto', '1.0.0', {
							from: oldNavTargetId,
							to: this.state.itemsById[payload.value.id].id
						})
					}
				},
				'nav:lock': payload => this.setAndTrigger({ locked: true }),
				'nav:unlock': payload => this.setAndTrigger({ locked: false }),
				'nav:close': payload => this.setAndTrigger({ open: false }),
				'nav:open': payload => this.setAndTrigger({ open: true }),
				'nav:toggle': payload => this.setAndTrigger({ open: !this.state.open }),
				'nav:openExternalLink': payload => {
					window.open(payload.value.url)
					return this.triggerChange()
				},
				'nav:showChildren': payload => {
					item = this.state.itemsById[payload.value.id]
					item.showChildren = true
					return this.triggerChange()
				},
				'nav:hideChildren': payload => {
					item = this.state.itemsById[payload.value.id]
					item.showChildren = false
					return this.triggerChange()
				},
				'question:scoreSet': payload => {
					let navItem = this.state.itemsById[payload.value.id]
					if (!navItem) {
						return
					}

					return NavUtil.setFlag(payload.value.id, 'correct', payload.value.score === 100)
				}
			},
			this
		)
	}

	init(model, startingId, startingPath) {
		this.state = {
			items: {},
			itemsById: {},
			itemsByPath: {},
			itemsByFullPath: {},
			navTargetHistory: [],
			navTargetId: null,
			locked: false,
			open: true,
			context: 'practice'
		}

		this.buildMenu(model)
		// console.clear()
		// console.log @state.items
		// debugger
		NavUtil.gotoPath(startingPath)

		if (startingId != null) {
			return NavUtil.goto(startingId)
		} else {
			let first = NavUtil.getFirst(this.state)

			if (first && first.id) NavUtil.goto(first.id)
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

			let navTargetModel = __guard__(NavUtil.getNavTargetModel(this.state), x =>
				x.processTrigger('onNavExit')
			)
			this.state.navTargetHistory.push(this.state.navTargetId)
			this.state.itemsById[this.state.navTargetId].showChildren = false
		}

		if (navItem.showChildrenOnNavigation) {
			navItem.showChildren = true
		}
		window.history.pushState({}, document.title, navItem.fullFlatPath)
		this.state.navTargetId = navItem.id
		NavUtil.getNavTargetModel(this.state).processTrigger('onNavEnter')
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

			// flatPath = ['view', model.getRoot().get('_id'), childNavItem.fullPath.join('/')].join('/')
			let flatPath = childNavItem.fullPath.join('/')
			childNavItem.flatPath = flatPath
			childNavItem.fullFlatPath = ['/view', model.getRoot().get('_id'), flatPath].join('/')
			this.state.itemsByPath[flatPath] = childNavItem
			this.state.itemsByFullPath[childNavItem.fullFlatPath] = childNavItem
		}

		this.state.itemsById[model.get('id')] = navItem

		return navItem
	}

	_clearFlags() {
		return Array.from(this.state.items).map(item => (item.flags.complete = false))
	}
}

let navStore = new NavStore()
window.__ns = navStore
export default navStore

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
