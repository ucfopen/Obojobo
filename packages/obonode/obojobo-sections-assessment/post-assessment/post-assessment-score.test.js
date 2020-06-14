import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import PostAssessmentScore from './post-assessment-score'

jest.mock('obojobo-pages-page/editor')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

import { Transforms } from 'slate'
jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('Actions editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Score component', () => {
		const component = renderer.create(
			<PostAssessmentScore
				element={{
					content: { for: '[0,100]' }
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Score component changes range', () => {
		const component = shallow(<PostAssessmentScore element={{ content: { for: '[0,100]' } }} />)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeRange updates the range', () => {
		const component = shallow(<PostAssessmentScore element={{ content: { for: '[0,100]' } }} />)
		const tree = component.html()

		component.instance().changeRange('mock range')

		expect(tree).toMatchSnapshot()
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Score component deletes self', () => {
		const component = shallow(
			<PostAssessmentScore
				element={{
					content: { for: '[0,100]' }
				}}
			/>
		)
		const tree = component.html()

		component.find('.delete-button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(Transforms.removeNodes).toHaveBeenCalled()
	})
})
