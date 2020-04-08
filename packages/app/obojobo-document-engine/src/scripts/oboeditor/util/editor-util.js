import Common from 'obojobo-document-engine/src/scripts/common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const domParser = new DOMParser()
const serial = new XMLSerializer()

const XML_MODE = 'xml'
const XML_MIME = 'application/xml'
const UNNAMED_MODULE = '(Unnamed Module)'
const MODULE_NODE_NAME = 'ObojoboDraft.Modules.Module'

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
	cleanModuleName(newName){
		if (!newName || !/[^\s]/.test(newName)) newName = UNNAMED_MODULE
		return newName.trim()
	},
	renameModule(moduleId, newName) {
		// If the module name is empty or just whitespace, provide a default value
		newName = EditorUtil.cleanModuleName(newName)

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
		try {
			const doc = domParser.parseFromString(draftModel, XML_MIME)
			let els = doc.getElementsByTagName('Module')
			if (els.length === 0) {
				els = doc.getElementsByTagName(MODULE_NODE_NAME)
			}
			if (els.length > 0) {
				const el = els[0]
				const title = el.getAttribute('title')
				if (!this.isEmptyString(title)) return title
			}

			return ''
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
			return ''
		}
	},
	getTitleFromJSON(draftModel) {
		try {
			const json = JSON.parse(draftModel)
			if (!json.content || this.isEmptyString(json.content.title)) return UNNAMED_MODULE

			return json.content.title
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
			return UNNAMED_MODULE
		}
	},
	isEmptyString(string) {
		return !string || !/[^\s]/.test(string)
	},
	getTitleFromString(draftModel, mode) {
		let title
		switch (mode) {
			case XML_MODE:
				title = this.getTitleFromXML(draftModel)
				break

			default:
				title = this.getTitleFromJSON(draftModel)
				break
		}

		return this.cleanModuleName(title)
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
	}
}

export default EditorUtil
