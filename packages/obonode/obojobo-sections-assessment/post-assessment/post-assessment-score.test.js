import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import PostAssessmentScore from './post-assessment-score'

jest.mock('obojobo-pages-page/editor')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

describe('Actions editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Score component', () => {
		const component = renderer.create(
			<PostAssessmentScore
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Score component changes range', () => {
		const component = shallow(<PostAssessmentScore node={{ data: { get: () => ({}) } }} />)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeRange updates the range', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}
		const component = shallow(<PostAssessmentScore node={{ data: { get: () => ({}) } }} editor={editor} />)
		const tree = component.html()

		component.instance().changeRange('mock range')

		expect(tree).toMatchSnapshot()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Score component deletes self', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = shallow(
			<PostAssessmentScore
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('.delete-button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

})
