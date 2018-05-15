import Common from 'Common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models

const getFlatList = function(item) {
	let list = []
	let model = OboModel.models[item.id]
	if (model && model.get('type') === 'ObojoboDraft.Sections.Assessment') {
		item.flags.assessment = true
	}
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

const NavUtil = {

	getNavTargetModel(itemsById, id) {
		let navTarget = itemsById[id]
		if (!navTarget) {
			return null
		}

		return OboModel.models[navTarget.id]
	},

	getFirst(items) {
		let list = NavUtil.getOrderedList(items)

		for (let item of Array.from(list)) {
			if (item.type === 'link') {
				return item
			}
		}

		return null
	},

	getPrev(items, currentItem) {
		let list = NavUtil.getOrderedList(items)
		let index = list.indexOf(currentItem)

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

	getNext(items, currentItem) {
		let list = NavUtil.getOrderedList(items)
		let index = list.indexOf(currentItem)

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

	getPrevModel(items, currentItem) {
		let prevItem = NavUtil.getPrev(items, currentItem)
		if (!prevItem) {
			return null
		}

		return OboModel.models[prevItem.id]
	},

	getNextModel(items, currentItem) {
		let nextItem = NavUtil.getNext(items, currentItem)
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

	getOrderedList(items) {
		return getFlatList(items)
	}
}

export default NavUtil
