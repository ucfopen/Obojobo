const initialState = {
	oboNodeList: [],
	adjList: [],
	navList: [],
	navItem: 0
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_STORE':
			return {
				...state,
				...convertObjectToAdjList(action.payload.oboNodeObject)
			};
		case 'UPDATE_NAV':
			return {
				...state,
				navItem: action.payload.value
			}
		default:
			return state
	}
}

// Algorithm: Breath First Search
const convertObjectToAdjList = object => {
	const oboNodeList = []
	const adjList = []

	let currentIndex = 0
	const queue = [{
		node: {
			...object
		},
		parentIndex: null
	}]

	while (queue.length > 0) {
		const {
			node,
			parentIndex
		} = queue.shift()

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
		navItem: 0
	}
}

export default reducer