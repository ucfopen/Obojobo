const { uuid } = Common.util

const initialState = {
	// Model State in Graph Theory Structure
	oboNodeList: [],
	adjList: [],
	parent: [],

	// Nav State
	navList: [],
	currNavIndex: 0,
	isNavEnabled: true,
	isNavLocked: false,
	navState: {
		items: {},
		itemsById: {},
		itemsByPath: {},
		itemsByFullPath: {},
		navTargetHistory: [],
		navTargetId: null,
		locked: false,
		open: true,
		context: 'practice',
		visitId: null
	},

	// Focus State
	currFocusNode: 0,

	// Media State
	mediaState: {
		shown: {},
		zoomById: {},
		defaultZoomById: {}
	},

	// Question State
	questionState: {
		viewing: null,
		viewedQuestions: {},
		scores: {},
		responses: {},
		data: {}
	}
}

const reducer = (state = initialState, action) => {
	const { type, payload } = action

	switch (type) {
		case 'UPDATE_STORE_MODEL':
			return {
				...state,
				...convertBackboneObjectToAdjList(payload.model)
			}
		case 'UPDATE_STORE':
			return {
				...state,
				...convertObjectToAdjList(payload.oboNodeObject)
			}
		case 'UPDATE_STATES':
			return {
				...state,
				...payload
			}
		case 'UPDATE_NAV_STATE':
			return {
				...state,
				...updateNavState()
			}
		case 'ON_SET_NAV_WITH_ID':
			let updatedNavIndex = state.currNavIndex
			state.navList.forEach((navNode, index) => {
				if (state.oboNodeList[navNode].attributes.id === payload.id) {
					updatedNavIndex = index
				}
			})
			return {
				...state,
				currNavIndex: updatedNavIndex
			}
		case 'ON_SET_NAV':
			return {
				...state,
				...updateNav(state, payload)
			}
		case 'ON_SET_NAV_PREV':
			return {
				...state,
				currNavIndex: state.currNavIndex - 1 >= 0 ? state.currNavIndex - 1 : 0
			}

		case 'ON_SET_NAV_NEXT':
			return {
				...state,
				currNavIndex:
					state.currNavIndex + 1 < state.navList.length
						? state.currNavIndex + 1
						: state.currNavIndex
			}

		case 'ON_SET_NAV_ENABLE':
			return {
				...state,
				isNavEnabled: payload !== undefined ? payload.value : !state.isNavEnabled
			}

		case 'ON_SET_NAV_LOCK':
			return {
				...state,
				isNavLocked: payload.value
			}

		case 'ON_SET_CURR_FOCUS':
			return {
				...state,
				currFocusNode: payload.index
			}
		case 'ON_SET_CURR_FOCUS_WITH_ID':
			return {
				...state,
				currFocusNode: state.mapIdToIndex[payload.id]
			}

		case 'UPDATE_MEDIA_STATE':
			return {
				...state,
				mediaState: payload.mediaState
			}
		case 'SET_DEFAULT_ZOOM':
			return {
				...state,
				...setDefaultZoom(state, payload)
			}
		case 'ON_SHOW_MEDIA':
			return {
				...state,
				...onShowMedia(state, payload)
			}
		case 'ON_SET_ZOOM':
			return {
				...state,
				...onSetZoom(state, payload)
			}
		case 'ON_RESET_ZOOM':
			return {
				...state,
				...onResetZoom(state, payload)
			}

		case 'VIEW_QUESTION':
			return {
				...state,
				...viewQuestion(state, payload)
			}
		case 'SET_QUESTION_RESPONSE':
			return {
				...state,
				...setQuestionResponse(state, payload)
			}
		case 'SET_QUESTION_SCORE':
			return {
				...state,
				...setQuestionScore(state, payload)
			}
		case 'SET_QUESTION_DATA':
			return {
				...state,
				...setQuestionData(state, payload)
			}
		case 'ON_RETRY_QUESTION':
			return {
				...state,
				...onRetryQuestion(state, payload)
			}
		default:
			return state
	}
}

const onRetryQuestion = (state, payload) => {
	const questionState = { ...state.questionState }
	const questionId = payload.value.id
	// const questionModel = oboNodeList[mapIdToIndex[questionId]]
	// const root = questionModel.getRoot()

	delete questionState.responses[payload.value.context][questionId]

	// APIUtil.postEvent({
	// 	draftId: root.get('draftId'),
	// 	action: 'question:retry',
	// 	eventVersion: '1.0.0',
	// 	visitId: NavStore.getState().visitId,
	// 	payload: {
	// 		questionId: questionId
	// 	}
	// })

	// if (QuestionUtil.isShowingExplanation(this.state, questionModel)) {
	// 	QuestionUtil.hideExplanation(questionId, 'viewerClient')
	// }

	delete questionState.scores[payload.value.context][questionId]
	return { questionState }
}

const setQuestionData = (state, payload) => {
	const questionState = { ...state.questionState }
	questionState.data[payload.value.key] = payload.value.value

	return { questionState }
}

const setQuestionScore = (state, payload) => {
	const questionState = { ...state.questionState }
	const scoreId = uuid()

	if (!questionState.scores[payload.value.context]) questionState.scores[payload.value.context] = {}

	questionState.scores[payload.value.context][payload.value.itemId] = {
		id: scoreId,
		score: payload.value.score,
		itemId: payload.value.itemId
	}

	return { questionState }
	// if (payload.value.score === 100) {
	// 	FocusUtil.clearFadeEffect()
	// }

	// this.triggerChange()

	// model = OboModel.models[payload.value.itemId]
	// APIUtil.postEvent({
	// 	draftId: model.getRoot().get('draftId'),
	// 	action: 'question:scoreSet',
	// 	eventVersion: '1.0.0',
	// 	visitId: NavStore.getState().visitId,
	// 	payload: {
	// 		id: scoreId,
	// 		itemId: payload.value.itemId,
	// 		score: payload.value.score,
	// 		context: payload.value.context
	// 	}
	// })
}

const setQuestionResponse = (state, payload) => {
	const questionState = state.questionState

	const id = payload.value.id
	const context = payload.value.context
	if (!questionState.responses[context]) questionState.responses[context] = {}
	questionState.responses[context][id] = payload.value.response

	return { questionState }
	// this.triggerChange()
	// APIUtil.postEvent({
	// 	draftId: OboModel.getRoot().get('draftId'),
	// 	action: 'question:setResponse',
	// 	eventVersion: '2.1.0',
	// 	visitId: NavStore.getState().visitId,
	// 	payload: {
	// 		questionId: id,
	// 		response: payload.value.response,
	// 		targetId: payload.value.targetId,
	// 		context,
	// 		assessmentId: payload.value.assessmentId,
	// 		attemptId: payload.value.attemptId
	// 	}
	// })
}

const viewQuestion = (state, payload) => {
	const questionState = state.questionState

	questionState.viewedQuestions[payload.value.id] = true
	questionState.viewing = payload.value.id

	return { questionState }
}

const onResetZoom = (state, payload) => {
	const id = payload.value.id
	const { oboNodeList, mapIdToIndex, mediaState } = state
	const model = oboNodeList[mapIdToIndex[id]]
	const defaultZoom = model.attributes.content.initialZoom || 1

	mediaState.zoomById[id] = defaultZoom
}

const onSetZoom = (state, payload) => {
	const id = payload.value.id
	const zoom = parseFloat(payload.value.zoom) || 0

	if (zoom <= 0) return

	const mediaState = state.mediaState
	mediaState.zoomById[id] = zoom

	return { mediaState }
}

const onShowMedia = (state, payload) => {
	const id = payload.value.id

	const mediaState = state.mediaState
	mediaState.shown[id] = true

	return { mediaState }
}

const setDefaultZoom = (state, payload) => {
	const id = payload.id
	let zoom = parseFloat(payload.initialZoom) || 0

	zoom = zoom > 0 ? zoom : 1

	const mediaState = state.mediaState
	if (!mediaState.defaultZoomById) mediaState.defaultZoomById = {}
	mediaState.defaultZoomById[id] = zoom

	return { mediaState }
}

const updateNav = (state, payload) => {
	const newNavNode = state.navList[payload.value]
	const newFocusNode = state.adjList[newNavNode][0]

	return {
		currNavIndex: payload.value,
		currFocusNode: newFocusNode
	}
}

// Algorithm: Breath First Search
const convertBackboneObjectToAdjList = object => {
	const oboNodeList = []
	const adjList = []
	const parent = []
	const mapIdToIndex = {}

	let currentIndex = 0
	const queue = [
		{
			node: {
				...object
			},
			parentIndex: null
		}
	]

	while (queue.length > 0) {
		const { node, parentIndex } = queue.shift()

		const newNode = {
			...node
		}
		if (node.attributes.type !== 'ObojoboDraft.Chunks.MCAssessment') delete newNode.children

		oboNodeList.push(newNode)
		parent.push(parentIndex)

		// Map node's id to its index
		mapIdToIndex[newNode.attributes.id] = currentIndex

		// Update adjList
		adjList.push([])
		if (parentIndex !== null) {
			adjList[parentIndex].push(currentIndex)
		}

		if (node.attributes.type !== 'ObojoboDraft.Chunks.MCAssessment')
			if (node.children) {
				for (let i = 0; i < node.children.models.length; i++) {
					queue.push({
						node: {
							...node.children.models[i]
						},
						parentIndex: currentIndex
					})
				}
			}
		currentIndex++
	}

	// Generate a list of Navigation item
	const navList = []
	if (adjList[0]) {
		for (let i = 0; i < adjList[0].length; i++) {
			const childIndex = adjList[0][i]
			if (oboNodeList[childIndex].attributes.type === 'ObojoboDraft.Sections.Content') {
				for (let j = 0; j < adjList[childIndex].length; j++) {
					navList.push(adjList[childIndex][j])
				}
			} else {
				navList.push(adjList[0][i])
			}
		}
	}

	// Set currFucusNode to the first node of the first navigation item
	const currFocusNode = adjList[navList[0]][0] || 0

	return {
		oboNodeList,
		adjList,
		parent,
		mapIdToIndex,
		navList,
		currNavIndex: 0,
		currFocusNode
	}
}

// Algorithm: Breath First Search
const convertObjectToAdjList = object => {
	const oboNodeList = []
	const adjList = []

	let currentIndex = 0
	const queue = [
		{
			node: {
				...object
			},
			parentIndex: null
		}
	]

	while (queue.length > 0) {
		const { node, parentIndex } = queue.shift()

		const newNode = {
			...node
		}
		delete newNode.children
		oboNodeList.push(newNode)

		adjList.push([])
		// Update adjList
		if (parentIndex !== null) {
			adjList[parentIndex].push(currentIndex)
		}

		if (node.children) {
			for (let i = 0; i < node.children.length; i++) {
				queue.push({
					node: {
						...node.children[i]
					},
					parentIndex: currentIndex
				})
			}
		}
		currentIndex++
	}

	// Generate a list of Navigation item
	const navList = []
	if (adjList[0]) {
		for (let i = 0; i < adjList[0].length; i++) {
			const childIndex = adjList[0][i]
			if (oboNodeList[childIndex].type === 'ObojoboDraft.Sections.Content') {
				for (let j = 0; j < adjList[childIndex].length; j++) {
					navList.push(adjList[childIndex][j])
				}
			} else {
				navList.push(adjList[0][i])
			}
		}
	}

	return {
		oboNodeList,
		adjList,
		navList,
		currNavIndex: 0
	}
}

export default reducer
