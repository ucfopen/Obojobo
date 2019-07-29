import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Registry } from 'Common'

const ObojoboContent = props => {
	const { moduleData } = props
	// Get states from Redux store
	const { oboNodeList, adjList, navList, currNavIndex, currFocusNode } = useSelector(state => state)

	const currFocusRef = useRef(null)

	useEffect(() => {
		// Scroll to current active component
		if (currFocusRef && currFocusRef.current) {
			const scrollIntoViewOptions = {
				behavior: 'smooth'
			}
			currFocusRef.current.scrollIntoView(scrollIntoViewOptions)
		}
	}, [currFocusNode])

	const componentRenderer = oboNodeIndex => {
		const currNode = oboNodeList[oboNodeIndex]
		// Nodes that are not work
		switch (currNode.attributes.type) {
			case 'ObojoboDraft.Sections.Assessment':
			case 'ObojoboDraft.Chunks.MCAssessment.MCChoice':
			case 'ObojoboDraft.Chunks.MCAssessment.MCFeedback':
			case 'ObojoboDraft.Chunks.MCAssessment.MCAnswer':
				return
			default:
				break
		}

		const Component = Registry.getItemForType(currNode.attributes.type).componentClass
		const model = {
			...currNode,
			myRef: oboNodeIndex === currFocusNode ? currFocusRef : null
		}
		return (
			<Component model={model} moduleData={moduleData} index={oboNodeIndex}>
				{adjList[oboNodeIndex].map(childIndex => {
					return componentRenderer(childIndex)
				})}
			</Component>
		)
	}

	const rootNode = oboNodeList[0]
	const Module = Registry.getItemForType(rootNode.attributes.type).componentClass
	return <Module model={rootNode}>{componentRenderer(navList[currNavIndex])}</Module>
}

export default ObojoboContent
