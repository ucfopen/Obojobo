import { mount, shallow } from 'enzyme'
import React from 'react'

import TriggerListModal from '../../../../src/scripts/oboeditor/components/triggers/trigger-list-modal'

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

describe('TriggerListModal', () => {
	test('TriggerListModal node', () => {
		const content = {
			triggers: [
				{
					type: 'onMount',
					actions: [
						{ type: 'nav:goto', value: {} }
					]
				}
			]
		}
		const component = shallow(<TriggerListModal content={content}/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})