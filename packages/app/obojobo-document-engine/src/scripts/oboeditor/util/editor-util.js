import Common from 'obojobo-document-engine/src/scripts/common'

const { Dispatcher } = Common.flux
const { OboModel } = Common.models
const domParser = new DOMParser()

const XML_MODE = 'xml'

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
			if (!json.content || this.isEmptyString(json.content.title)) return '(Unnamed Module)'

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
		switch (mode) {
			case XML_MODE:
				return this.getTitleFromXML(draftModel)
			default:
				return this.getTitleFromJSON(draftModel)
		}
	},
	youTubeParseUrl(videoUrl) {
		let newVideoId = false
		let videoStartTime = false
		let videoEndTime = false


// [&t=]*(([0-9]*m)*
// [&|?]start=([0-9]*)
//
		// const youTubeSiteRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)[&t=]*(([0-9]*m)*([0-9]*s)*)*.*/;
		// const youTubeSiteRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)[&t=]*(([0-9]*m)*([0-9]*s)*)*[[&|?]	start=]*(([0-9]*m)*([0-9]*s)*)*[[&|?]end=]*(([0-9]*m)*([0-9]*s)*)*.*/;
		// const youTubeSiteRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)[&t=]*(([0-9]*m)*([0-9]*s)*)*[&|?]start=([0-9]*)[&|?]end=([0-9]*).*/;
		// const youTubeSiteRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)[&|?][t=|start=]*(([0-9]*m?)*([0-9]*s?)*)*[&|?][end=]*(([0-9]*m?)*([0-9]*s?)*)*.*/;
		const youTubeSiteRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*)[&t=]*(([0-9]*m)*([0-9]*s)*)*.*/;
		const youTubeSiteRegexMatch = videoUrl.match(youTubeSiteRegex)

		// match 7 is the ID
		// match 8 is the m and s
		// match 9 is the m
		// match 10 is the s
		// match 11 is the start time in seconds
		// match 12 is the end time in seconds

		console.log("youTubeSiteRegexMatch", youTubeSiteRegexMatch);


		if (youTubeSiteRegexMatch) {
				// min will be match[9] or match[11]
				// seconds will be match[10] or match[12]



				const min = youTubeSiteRegexMatch[9]? parseInt(youTubeSiteRegexMatch[9],10) : 0
				const sec = youTubeSiteRegexMatch[10]? parseInt(youTubeSiteRegexMatch[10],10) : 0

				videoStartTime = 60*min + sec

				newVideoId = (youTubeSiteRegexMatch[7].length==11)? youTubeSiteRegexMatch[7] : false;
		}


		console.log("newVideoId", newVideoId);
		console.log("videoStartTime", videoStartTime);
		console.log("videoEndTime", videoEndTime);

		return {
			videoId: newVideoId,
			startTime: videoStartTime,
			endTime: videoEndTime
		}

	}
}

export default EditorUtil
