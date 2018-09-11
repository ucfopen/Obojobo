import Common from 'Common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models

const getFlatList = function(item) {
	let list = []
	const model = OboModel.models[item.id]
	if (model && model.get('type') === 'ObojoboDraft.Sections.Assessment') {
		item.flags.assessment = true
	}
	if (item.type !== 'hidden') {
		list.push(item)
	}

	if (item.showChildren) {
		for (const child of Array.from(item.children)) {
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
	addAssessment(newAssessment) {
		return Dispatcher.trigger('editor:addAssessment', {
			value: {
				newAssessment
			}
		})
	},
	deletePage(pageId) {
		return Dispatcher.trigger('editor:deletePage', {
			value: {
				pageId
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
		const list = EditorUtil.getOrderedList(state)

		for (const item of Array.from(list)) {
			if (item.type === 'link') {
				return item
			}
		}

		return null
	},
	getNavItemForModel(state, model) {
		const item = state.itemsById[model.get('id')]
		if (!item) {
			return null
		}

		return item
	},
	getNavLabelForModel(state, model) {
		const item = EditorUtil.getNavItemForModel(state, model)
		if (!item) {
			return null
		}

		return item.label
	},
	getOrderedList(state) {
		return getFlatList(state.items)
	},
	getNavTarget(state) {
		return state.itemsById[state.navTargetId]
	},
	getNavTargetModel(state) {
		const navTarget = EditorUtil.getNavTarget(state)
		if (!navTarget) {
			return null
		}

		return OboModel.models[navTarget.id]
	},
	renamePage(pageId, name) {
		return Dispatcher.trigger('editor:renamePage', {
			value: {
				pageId,
				name
			}
		})
	},
	movePage(pageId, index) {
		return Dispatcher.trigger('editor:movePage', {
			value: {
				pageId,
				index
			}
		})
	}
}

export default EditorUtil
