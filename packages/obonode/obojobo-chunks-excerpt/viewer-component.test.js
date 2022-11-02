import React from 'react'
import renderer from 'react-test-renderer'

import Excerpt from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

const chunkJSON = {
	id: 'id',
	type: "ObojoboDraft.Chunks.Excerpt",
    content: {
        bodyStyle: "filled-box",
        width: "medium",
        font: "sans",
        lineHeight: "moderate",
        fontSize: "smaller",
        topEdge: "normal",
        bottomEdge: "normal",
        effect: false
    },
    children: [
        {
            type: "ObojoboDraft.Chunks.Excerpt",
            subtype: "ObojoboDraft.Chunks.Excerpt.ExcerptContent",
            content: {},
            children: [
                {
                type: "ObojoboDraft.Chunks.Text",
                content: {},
                children: [
                    {
                    type: "ObojoboDraft.Chunks.Text",
                    subtype: "ObojoboDraft.Chunks.Text.TextLine",
                    content: {
                        indent: 0
                    },
                    children: [
                        {
                        text: ""
                        }
                    ]
                    }
                ]
                }
            ]
        },
        {
            type: "ObojoboDraft.Chunks.Excerpt",
            subtype: "ObojoboDraft.Chunks.Excerpt.CitationText",
            content: {
                indent: 0,
                hangingIndent: 0
            },
            children: [
                {
                type: "ObojoboDraft.Chunks.Excerpt",
                subtype: "ObojoboDraft.Chunks.Excerpt.CitationLine",
                content: {
                    indent: 0,
                    hangingIndent: 0,
                    align: "center"
                },
                children: [
                    {
                    text: ""
                    }
                ]
                }
            ]
        }
    ]
}

require('./viewer') // used to register this oboModel

describe('Excerpt', () => {
	test('Excerpt component', () => {
		const model = OboModel.create(chunkJSON)
		const moduleData = {
			focusState: {}
		}
		const component = renderer.create(<Excerpt model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
