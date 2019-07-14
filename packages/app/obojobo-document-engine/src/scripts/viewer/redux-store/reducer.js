const initialState = {
	oboNodeList: [],
	adjList: []
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_STORE':
			return {
				...state,
				...convertObjectToAdjList(action.payload.oboNodeObject)
			}
		default:
			return state
	}
}

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

	return {
		oboNodeList,
		adjList
	}
}

export default reducer
