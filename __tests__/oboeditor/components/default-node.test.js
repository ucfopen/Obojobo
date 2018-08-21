import React from 'react'
import renderer from 'react-test-renderer'

import DefaultNode from '../../../src/scripts/oboeditor/components/default-node'

describe('DefaultNode', () => {
	test('Node builds the expected component', () => {
		const Node = DefaultNode.components.Node
		const component = renderer.create(<Node attributes={{dummy: 'dummyData'}} children={'mockChildren'} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType'
		}
		const oboNode = DefaultNode.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: type => {}
			}
		}
		const oboNode = DefaultNode.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboNode to a Slate node', () => {
		const oboNode = {
			id: 'mockKey',
			type: 'mockType'
		}
		const slateNode = DefaultNode.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
