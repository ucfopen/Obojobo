import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import { Registry } from 'Common'

const ObojoboContent = props => {

    const { moduleData, oboNodeList, adjList, navList, currentNavIndex, currFocusNode } = props

    const currRef = useRef(null)

    useEffect(() => {
        // Scroll to current active component
        if (currRef && currRef.current) {
            currRef.current.scrollIntoView()
        }
    }, [currFocusNode])

    const componentRenderer = index => {
        // Nodes that are not work
        switch(oboNodeList[index].attributes.type){
            case 'ObojoboDraft.Chunks.Question':
            case 'ObojoboDraft.Chunks.IFrame':
            case 'ObojoboDraft.Chunks.ActionButton':
            case 'ObojoboDraft.Sections.Assessment':
                return
            default:
                break
        }

        const Component = Registry.getItemForType(oboNodeList[index].attributes.type).componentClass
        const model = {
            ...oboNodeList[index],
            myRef: index === currFocusNode ? currRef : null
        }
        return (
            <Component model={model} moduleData={moduleData} >
                {adjList[index].map(childIndex => {
                    return componentRenderer(childIndex)
                })}
            </Component>
        )
    }


    const Module = Registry.getItemForType(oboNodeList[0].attributes.type).componentClass

    return (
        <Module model={oboNodeList[0]} moduleData={moduleData}>
            {componentRenderer(navList[currentNavIndex])}
        </Module>
    )
}

const mapStateToProps = ({ oboNodeList, adjList, navList, currentNavIndex, currFocusNode }) => {
	return {
		oboNodeList,
        adjList,
        navList,
        currentNavIndex,
        currFocusNode
	}
}

export default connect(mapStateToProps)(ObojoboContent)
