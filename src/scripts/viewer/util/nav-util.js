import Common from 'Common'

let { Dispatcher } = Common.flux
let { OboModel } = Common.models

var getFlatList = function(item) {
	let list = []
	if (item.type !== 'hidden') {
		list.push(item)
	}

	if (item.showChildren) {
		for (let child of Array.from(item.children)) {
			list = list.concat(getFlatList(child))
		}
	}

	return list
}

var NavUtil = {
	rebuildMenu(model) {
		return Dispatcher.trigger('nav:rebuildMenu', {
			value: {
				model
			}
		})
	},

	gotoPath(path) {
		return Dispatcher.trigger('nav:gotoPath', {
			value: {
				path
			}
		})
	},

	// gotoCurrentPathname: () ->
	// 	window.location.pathname

	setFlag(id, flagName, flagValue) {
		return Dispatcher.trigger('nav:setFlag', {
			value: {
				id,
				flagName,
				flagValue
			}
		})
	},
	goPrev() {
		return Dispatcher.trigger('nav:prev')
	},

	goNext() {
		return Dispatcher.trigger('nav:next')
	},

	goto(id) {
		return Dispatcher.trigger('nav:goto', {
			value: {
				id
			}
		})
	},

	lock() {
		return Dispatcher.trigger('nav:lock')
	},

	unlock() {
		return Dispatcher.trigger('nav:unlock')
	},

	close() {
		return Dispatcher.trigger('nav:close')
	},

	open() {
		return Dispatcher.trigger('nav:open')
	},

	toggle() {
		return Dispatcher.trigger('nav:toggle')
	},

	openExternalLink(url) {
		return Dispatcher.trigger('nav:openExternalLink', {
			value: {
				url
			}
		})
	},

	showChildren(id) {
		return Dispatcher.trigger('nav:showChildren', {
			value: {
				id
			}
		})
	},

	hideChildren(id) {
		return Dispatcher.trigger('nav:hideChildren', {
			value: {
				id
			}
		})
	},

	getNavTarget(state) {
		return state.itemsById[state.navTargetId]
	},

	getNavTargetModel(state) {
		let navTarget = NavUtil.getNavTarget(state)
		if (!navTarget) {
			return null
		}

		return OboModel.models[navTarget.id]
	},

	getFirst(state) {
		let list = NavUtil.getOrderedList(state)

		for (let item of Array.from(list)) {
			if (item.type === 'link') {
				return item
			}
		}

		return null
	},

	getPrev(state) {
		// state.items[NavUtil.getPrevIndex(state)]
		let list = NavUtil.getOrderedList(state)
		let navTarget = NavUtil.getNavTarget(state)
		let index = list.indexOf(navTarget)

		if (index === -1) {
			return null
		}

		index--
		while (index >= 0) {
			let item = list[index]
			if (item.type === 'link') {
				return item
			}

			index--
		}

		return null
	},

	getNext(state) {
		// state.items[NavUtil.getPrevIndex(state)]
		let list = NavUtil.getOrderedList(state)
		let navTarget = NavUtil.getNavTarget(state)
		let index = list.indexOf(navTarget)

		if (index === -1) {
			return null
		}

		index++
		let len = list.length
		while (index < len) {
			let item = list[index]
			if (item.type === 'link') {
				return item
			}

			index++
		}

		return null
	},

	getPrevModel(state) {
		let prevItem = NavUtil.getPrev(state)
		if (!prevItem) {
			return null
		}

		return OboModel.models[prevItem.id]
	},

	getNextModel(state) {
		let nextItem = NavUtil.getNext(state)
		if (!nextItem) {
			return null
		}

		return OboModel.models[nextItem.id]
	},

	getNavItemForModel(state, model) {
		let item = state.itemsById[model.get('id')]
		if (!item) {
			return null
		}

		return item
	},

	getNavLabelForModel(state, model) {
		let item = NavUtil.getNavItemForModel(state, model)
		if (!item) {
			return null
		}

		return item.label
	},

	canNavigate(state) {
		return !state.locked
	},

	getOrderedList(state) {
		return getFlatList(state.items)
	},

	setContext(context) {
		return Dispatcher.trigger('nav:setContext', {
			value: {
				context
			}
		})
	},

	getContext(state) {
		return state.context
	}
}

export default NavUtil
