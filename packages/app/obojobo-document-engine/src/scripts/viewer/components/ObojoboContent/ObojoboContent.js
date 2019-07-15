import React from 'react'
import { connect } from 'react-redux'

import { Registry } from 'Common'

const obojoboContent = props => {

    const componentRenderer = index => {
        // Nodes that are not work
        switch(oboNodeList[index].attributes.type){
            case 'ObojoboDraft.Chunks.Question':
            case 'ObojoboDraft.Chunks.IFrame':
            case 'ObojoboDraft.Chunks.ActionButton':
            case 'ObojoboDraft.Chunks.Table':
            case 'ObojoboDraft.Sections.Assessment':
                return
            default:
                break
        }

        const Component = Registry.getItemForType(oboNodeList[index].attributes.type).componentClass

        return (
            <Component model={oboNodeList[index]}>
                {adjList[index].map(childIndex => {
                    return componentRenderer(childIndex)
                })}
            </Component>
        )
    }


    const { oboNodeList, adjList, navList, currentNavIndex } = props
    const Module = Registry.getItemForType(oboNodeList[0].attributes.type).componentClass

    return (
        <Module index={0} model={oboNodeList[0]} moduleData={props.moduleData}>
            {componentRenderer(navList[currentNavIndex])}
        </Module>
    )
}

const mapStateToProps = ({ oboNodeList, adjList, navList, currentNavIndex }) => {
	return {
		oboNodeList,
        adjList,
        navList,
        currentNavIndex
	}
}

export default connect(mapStateToProps, null)(obojoboContent)
