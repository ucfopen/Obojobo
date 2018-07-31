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

const EditorUtil = {
	rebuildMenu(model) {
		return Dispatcher.trigger('editor:rebuildMenu', {
			value: {
				model
			}
		})
	},
	goto(id) {
		return Dispatcher.trigger('editor:goto', {
			value: {
				id
			}
		})
	},
	addPage(newPage) {
		return Dispatcher.trigger('editor:addPage', {
			value: {
				newPage
			}
		})
	},
	gotoPath(path) {
		return Dispatcher.trigger('editor:gotoPath', {
			value: {
				path
			}
		})
	},
	getFirst(state) {
		let list = EditorUtil.getOrderedList(state)

		for (let item of Array.from(list)) {
			if (item.type === 'link') {
				return item
			}
		}

		return null
	},
	getNavItemForModel(state, model) {
		let item = state.itemsById[model.get('id')]
		if (!item) {
			return null
		}

		return item
	},
	getNavLabelForModel(state, model) {
		let item = EditorUtil.getNavItemForModel(state, model)
		if (!item) {
			return null
		}

		return item.label
	},
	getOrderedList(state) {
		return getFlatList(state.items)
	},
	startSaveDraft() {
		return Dispatcher.trigger('editor:setContext', {
			value: {
				context: 'saving'
			}
		})
	},
	finishSaveDraft() {
		return Dispatcher.trigger('editor:setContext', {
			value: {
				context: 'editor'
			}
		})
	},

	setFlag(id, flagName, flagValue) {
		return Dispatcher.trigger('editor:setFlag', {
			value: {
				id,
				flagName,
				flagValue
			}
		})
	},
	goPrev() {
		return Dispatcher.trigger('editor:prev')
	},

	goNext() {
		return Dispatcher.trigger('editor:next')
	},
	close() {
		return Dispatcher.trigger('editor:close')
	},

	open() {
		return Dispatcher.trigger('editor:open')
	},

	toggle() {
		return Dispatcher.trigger('editor:toggle')
	},

	openExternalLink(url) {
		return Dispatcher.trigger('editor:openExternalLink', {
			value: {
				url
			}
		})
	},

	showChildren(id) {
		return Dispatcher.trigger('editor:showChildren', {
			value: {
				id
			}
		})
	},

	hideChildren(id) {
		return Dispatcher.trigger('editor:hideChildren', {
			value: {
				id
			}
		})
	},

	getNavTarget(state) {
		return state.itemsById[state.navTargetId]
	},

	getNavTargetModel(state) {
		let navTarget = EditorUtil.getNavTarget(state)
		if (!navTarget) {
			return null
		}

		return OboModel.models[navTarget.id]
	},

	getPrev(state) {
		let list = EditorUtil.getOrderedList(state)
		let navTarget = EditorUtil.getNavTarget(state)
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
		let list = EditorUtil.getOrderedList(state)
		let navTarget = EditorUtil.getNavTarget(state)
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
		let prevItem = EditorUtil.getPrev(state)
		if (!prevItem) {
			return null
		}

		return OboModel.models[prevItem.id]
	},

	getNextModel(state) {
		let nextItem = EditorUtil.getNext(state)
		if (!nextItem) {
			return null
		}

		return OboModel.models[nextItem.id]
	},

	canNavigate(state) {
		return !state.locked
	},

	setContext(context) {
		return Dispatcher.trigger('editor:setContext', {
			value: {
				context
			}
		})
	}
}

export default EditorUtil
