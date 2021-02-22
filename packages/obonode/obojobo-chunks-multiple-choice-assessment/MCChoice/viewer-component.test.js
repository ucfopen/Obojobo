import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')

import MCChoice from './viewer-component'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'

const getDefaultProps = ({ choiceScore, questionSubmitted, mode, responseType, questionType }) => ({
	model: {
		getDomId: () => 'mock-dom-id',
		processTrigger: jest.fn(),
		get: () => 'mock-id',
		modelState: { score: choiceScore },
		parent: {
			get: () => 'mock-parent-id'
		},
		children: [
			{
				get: key => {
					switch (key) {
						case 'id':
							return 'mock-id-mc-answer'

						case 'type':
							return 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
					}
				},
				getComponentClass: () =>
					function C() {
						return <div>MCAnswer</div>
					}
			},
			{
				get: key => {
					switch (key) {
						case 'id':
							return 'mock-id-mc-feedback'

						case 'type':
							return 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
					}
				},
				getComponentClass: () =>
					function C() {
						return <div>MCFeedback</div>
					}
			}
		]
	},
	questionSubmitted,
	mode,
	responseType,
	questionModel: { get: () => 'mock-question-model-id', modelState: { type: questionType } },
	moduleData: {
		navState: { context: 'mockContext' },
		questionState: { contexts: { mockContext: { data: {} } } },
		focusState: {}
	}
})

describe('MCChoice viewer-component', () => {
	// questionTypes can be 'default' or 'survey'
	// mode can be 'practice', 'assessment' or 'review'
	test.each`
		responseType  | questionType | mode            | response                 | questionSubmitted | choiceScore | className
		${'pick-one'} | ${'default'} | ${'practice'}   | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-review'}
		${'pick-one'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-one'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-practice'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-assessment'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-not-correct-choice is-type-should-not-have-chosen is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-not-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-correctly is-mode-review'}
		${'pick-all'} | ${'default'} | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-could-have-chosen is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'practice'}   | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-practice'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'assessment'} | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-assessment'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${null}                  | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${null}                  | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${0}        | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${0}        | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${null}                  | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${false}          | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${false}          | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${null}                  | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['mock-id'] }}  | ${true}           | ${100}      | ${'is-selected is-correct-choice is-type-chosen-survey is-mode-review'}
		${'pick-all'} | ${'survey'}  | ${'review'}     | ${{ ids: ['other-id'] }} | ${true}           | ${100}      | ${'is-not-selected is-correct-choice is-type-unchosen-correctly is-mode-review'}
	`(
		'construct(responseType="$responseType",questionType="$questionType",mode="$mode",questionSubmitted="$questionSubmitted",score="$score",response="$response") = "$className"',
		({ choiceScore, questionSubmitted, mode, responseType, questionType, response, className }) => {
			const props = getDefaultProps({
				choiceScore,
				questionSubmitted,
				mode,
				responseType,
				questionType
			})

			QuestionUtil.getResponse.mockReturnValue(response)
			QuestionUtil.getScoreForModel.mockReturnValue(choiceScore)
			const component = renderer.create(<MCChoice {...props} />)

			const tree = component.toJSON()

			expect(tree).toMatchSnapshot()
			expect(tree.props.className).toBe(
				`component obojobo-draft--chunks--mc-assessment--mc-choice ${className}`
			)
		}
	)
})
