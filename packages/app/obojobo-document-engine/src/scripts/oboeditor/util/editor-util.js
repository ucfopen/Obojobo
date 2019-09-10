import Common from 'Common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const domParser = new DOMParser()

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

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
	addPage(newPage, afterPageId) {
		return Dispatcher.trigger('editor:addPage', {
			value: {
				newPage,
				afterPageId
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
		return getFlatList(state.navItems)
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
	},
	setStartPage(pageId) {
		return Dispatcher.trigger('editor:setStartPage', {
			value: {
				pageId
			}
		})
	},
	getTitleFromXML(draftModel) {
		try {
			const doc = domParser.parseFromString(draftModel, 'application/xml')
			let els = doc.getElementsByTagName('Module')
			if (els.length === 0) {
				els = doc.getElementsByTagName('ObojoboDraft.Modules.Module')
			}
			if (els.length > 0) {
				const el = els[0]
				const title = el.getAttribute('title')
				if (!this.isEmptyString(title)) return title
			}

			return '(Unnamed Module)'
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
			return '(Unnamed Module)'
		}
	},
	getTitleFromJSON(draftModel) {
		try {
			const json = JSON.parse(draftModel)
			if(!json.content || this.isEmptyString(json.content.title)) return '(Unnamed Module)'

			return json.content.title
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
			return '(Unnamed Module)'
		}
	},
	isEmptyString(string) {
		return !string || !/[^\s]/.test(string)
	},
	getTitleFromString(draftModel, mode) {
		switch(mode) {
			case XML_MODE:
				return this.getTitleFromXML(draftModel)
			default:
				return this.getTitleFromJSON(draftModel)
		}
	},
}

export default EditorUtil
