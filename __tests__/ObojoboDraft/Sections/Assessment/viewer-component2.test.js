import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

let mockComponent = props => <div {...props} />
let mockGetComponentClass = <div />

// Common
jest.mock('../../../../src/scripts/common/index', () => ({
	Store: {
		registerModel: jest.fn()
	},
	components: {
		OboComponent: mockComponent
	},
	models: {
		OboModel: {
			create: jest.fn()
		}
	},
	flux: {},
	util: {}
}))

// Viewer
jest.mock('../../../../src/scripts/viewer/index', () => ({
	stores: {
		ScoreStore: {}
	},
	util: {
		AssessmentUtil: {
			getLastAttemptScoreForModel: jest.fn(),
			getAssessmentScoreForModel: jest.fn(),
			getLTIStateForModel: jest.fn(),
			getAssessmentForModel: jest.fn(),
			isCurrentAttemptComplete: jest.fn()
		},
		NavUtil: {}
	}
}))

// LTIStatus
jest.mock('../../../../ObojoboDraft/Sections/Assessment/lti-status', () => ({}))

jest.mock('../../../../ObojoboDraft/Sections/Content/viewer-component', () => ({}))
jest.mock('../../../../ObojoboDraft/Sections/Assessment/attempt-incomplete-dialog', () => ({}))
// import AttemptIncompleteDialog from './attempt-incomplete-dialog'

const Common = require('../../../../src/scripts/common/index')
const Assessment = require('../../../../ObojoboDraft/Sections/Assessment/viewer-component').default
const Viewer = require('../../../../src/scripts/viewer/index')
const { AssessmentUtil } = Viewer.util

describe('Assessment', () => {
	beforeEach(() => {})

	test('untested state renders as expected', () => {
		let assessmentModel = {
			id: 'rootId',
			type: 'ObojoboDraft.Modules.Module',
			children: {
				at: jest.fn().mockReturnValue({
					getComponentClass: () => mockComponent
				})
			}
		}

		let moduleData = {
			lti: {
				outcomeServiceHostname: 'mockHostName'
			}
		}

		// cause getCurentStap to be 'untested'
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		const component = renderer.create(
			<Assessment model={assessmentModel} moduleData={moduleData} />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
