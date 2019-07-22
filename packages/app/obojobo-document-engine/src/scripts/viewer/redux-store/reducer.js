const initialState = {
	// List of OboNodes
	oboNodeList: [],
	// Adjacency List
	adjList: [],

	// Indexes of all navigation items
	navList: [],
	currentNavIndex: 0,
	isNavEnabled: true,
	isNavLocked: false,

	// Index of focus node
	currFocusNode: 0
}

const reducer = (state = initialState, action) => {
	const { type, payload } = action

	switch (type) {
		// Initialize Store with Backbone object
		case 'UPDATE_STORE_MODEL':
			return {
				...state,
				...convertBackboneObjectToAdjList(payload.model)
			}
		// Initialize Store with JS object
		case 'UPDATE_STORE':
			return {
				...state,
				...convertObjectToAdjList(payload.oboNodeObject)
			}
		// Update current navigation item
		case 'UPDATE_NAV':
			return {
				...updateNav(state, payload)
			}
		case 'ON_SET_NAV_PREV':
			return {
				...state,
				currentNavIndex: state.currentNavIndex - 1 >= 0 ? state.currentNavIndex - 1 : 0
			}
		case 'ON_SET_NAV_WITH_ID':
			let updatedNavIndex = state.currentNavIndex
			state.navList.forEach((navNode, index) => {
				if (state.oboNodeList[navNode].attributes.id === payload.id) {
					updatedNavIndex = index
				}
			})
			return {
				...state,
				currentNavIndex: updatedNavIndex
			}
		case 'ON_SET_NAV_NEXT':
			return {
				...state,
				currentNavIndex:
					state.currentNavIndex + 1 < state.navList.length
						? state.currentNavIndex + 1
						: state.currentNavIndex
			}
		// Set isNavEnbled to payload.value of payload exists else toggle navigation
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
		// Update focus node
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
		default:
			return state
	}
}

const updateNav = (state, payload) => {
	const newNavNode = state.navList[payload.value]
	const newFocusNode = state.adjList[newNavNode][0]

	return {
		...state,
		currentNavIndex: payload.value,
		currFocusNode: newFocusNode
	}
}

// Algorithm: Breath First Search
const convertBackboneObjectToAdjList = object => {
	const oboNodeList = []
	const adjList = []
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
		delete newNode.children
		oboNodeList.push(newNode)

		// Map node's id to its index
		mapIdToIndex[newNode.attributes.id] = currentIndex

		// Update adjList
		adjList.push([])
		if (parentIndex !== null) {
			adjList[parentIndex].push(currentIndex)
		}

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
		mapIdToIndex,
		navList,
		currentNavIndex: 0,
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
		currentNavIndex: 0
	}
}

export default reducer
