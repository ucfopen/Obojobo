import React from 'react'
import { mount } from 'enzyme'

import ImportQuestionModal from './import-questions-modal'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import Common from 'obojobo-document-engine/src/scripts/common'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('./model-renderer', () => () => <div>Item</div>)
// jest.mock('./modelRenderer', () => ({
// 	Controlled: global.mockReactComponent(this, 'ModelRender')
// }))
// import Registry from 'obojobo-document-engine/src/scripts/common/registry'
jest.mock('obojobo-document-engine/src/scripts/common/registry')

describe('ImportQuestionModal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
	})

	test('ImportQuestionModal component', () => {
		const props = {
			importQuestions: jest.fn(),
			questionList: [
				{ id: 'id_1', children: [{ id: 'child_id_1' }] },
				{ id: 'id_2', children: [{ id: 'child_id_1' }] }
			]
		}

		const component = mount(<ImportQuestionModal {...props} />)

		expect(component.html()).toMatchSnapshot()
	})

	test('ImportQuestionModal component clicks on question updates the state', async () => {
		const props = {
			importQuestions: jest.fn(),
			questionList: [
				{ id: 'id_1', children: [{ id: 'child_id_1' }] },
				{ id: 'id_2', children: [{ id: 'child_id_1' }] }
			]
		}

		const component = mount(<ImportQuestionModal {...props} />)

		component
			.find('.import-model--question-content')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('ImportQuestionModal component calls confirm', async () => {
		jest.spyOn(Common.Registry, 'getItemForType').mockReturnValue({
			oboToSlate: jest.fn()
		})
		const props = {
			importQuestions: jest.fn(),
			questionList: [
				{ id: 'id_1', children: [{ id: 'child_id_1' }] },
				{ id: 'id_2', children: [{ id: 'child_id_1' }] }
			]
		}

		const component = mount(<ImportQuestionModal {...props} />)

		component
			.find('.import-model--question-content')
			.at(0)
			.simulate('click')

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(props.importQuestions).toHaveBeenCalledTimes(1)
		expect(ModalUtil.hide).toHaveBeenCalledTimes(1)
	})
})
