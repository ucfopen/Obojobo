import React from 'react'
import { connect } from 'react-redux'

import { Registry } from 'Common'

const obojoboContent = props => {

    const { oboNodeList, adjList, navList, navItem } = props

    const Module = Registry.getItemForType(oboNodeList[0].type).componentClass

    const componentRenderer = index => {
        switch(oboNodeList[index].type){
            // modify node
            case 'ObojoboDraft.Pages.Page':
            case 'ObojoboDraft.Chunks.Heading':
            case 'ObojoboDraft.Chunks.YouTube':
            case 'ObojoboDraft.Chunks.Text':
            case 'ObojoboDraft.Chunks.Code':
            case 'ObojoboDraft.Chunks.Break':
                break
            default:
                return null
        }

        const Component = Registry.getItemForType(oboNodeList[index].type).componentClass

        return (
            <Component node={oboNodeList[index]}>
                {adjList[index].map(childIndex => {
                    return componentRenderer(childIndex)
                })}
            </Component>
        )
    }


    return (
        <Module node={oboNodeList[0]}>
            {componentRenderer(navList[navItem])}
        </Module>
    )
}

const mapStateToProps = ({ oboNodeList, adjList, navList, navItem }) => {
	return {
		oboNodeList,
        adjList,
        navList,
        navItem
	}
}

export default connect(mapStateToProps, null)(obojoboContent)
