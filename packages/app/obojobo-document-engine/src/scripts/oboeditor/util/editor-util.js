import Common from 'obojobo-document-engine/src/scripts/common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const domParser = new DOMParser()
const serial = new XMLSerializer()

const XML_MODE = 'xml'
const XML_MIME = 'application/xml'
const MODULE_NODE_NAME = 'ObojoboDraft.Modules.Module'
const ASSESSMENT_NODE_NAME = 'ObojoboDraft.Sections.Assessment'

const getFlatList = function(item) {
	let list = []
	const model = OboModel.models[item.id]
	if (model && model.get('type') === ASSESSMENT_NODE_NAME) {
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
	renameModule(moduleId, newName) {
		return Dispatcher.trigger('editor:renameModule', {
			value: {
				moduleId,
				name: newName
			}
		})
	},
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
		let title = ''
		try {
			// convert xml string to XMLDocument
			const doc = domParser.parseFromString(draftModel, XML_MIME)
			// find the module element (only one right now)
			let els = doc.getElementsByTagName('Module')
			if (els.length === 0) {
				els = doc.getElementsByTagName(MODULE_NODE_NAME)
			}
			if (els.length > 0) {
				// get the attributes off the module element
				const el = els[0]
				const _title = el.getAttribute('title')
				if (!this.isEmptyString(_title)) title = _title
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return title
	},
	getTitleFromJSON(draftModel) {
		let title = ''
		try {
			const json = JSON.parse(draftModel)
			if (json.content && !this.isEmptyString(json.content.title)) {
				title = json.content.title
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return title
	},
	isEmptyString(string) {
		return !string || !/[^\s]/.test(string)
	},
	getTitleFromString(draftModel, mode) {
		switch (mode) {
			case XML_MODE:
				return this.getTitleFromXML(draftModel)

			default:
				return this.getTitleFromJSON(draftModel)
		}
	},
	setModuleTitleInJSON(code, title) {
		const json = JSON.parse(code)
		json.content.title = title
		return JSON.stringify(json, null, 4)
	},
	setModuleTitleInXML(code, title) {
		const doc = domParser.parseFromString(code, XML_MIME)
		let els = doc.getElementsByTagName('Module')
		if (els.length === 0) {
			els = doc.getElementsByTagName(MODULE_NODE_NAME)
		}
		if (els.length > 0) {
			const el = els[0]
			el.setAttribute('title', title)
		}
		return serial.serializeToString(doc)
	},
	getCurrentAssessmentId(models) {
		for (const id in models) {
			// Safe checking before accessing multiple nested obj attributes.
			if (
				models[id] &&
				typeof models[id] !== 'undefined' &&
				models[id].attributes &&
				typeof models[id].attributes !== 'undefined' &&
				models[id].attributes.type === ASSESSMENT_NODE_NAME
			) {
				return id
			}
		}
		return null
	}
}

export default EditorUtil
