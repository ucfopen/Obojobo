import { getLabel } from './feedback-labels'

describe('feedbackLabels', () => {
	test.each`
		correctLabels           | incorrectLabels           | score         | isReview | isSurvey | hasResponse | expectedValue
		${null}                 | ${null}                   | ${null}       | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${null}       | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${null}       | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${null}       | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                   | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                   | ${100}        | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${null}                   | ${100}        | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${null}                   | ${100}        | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${null}                   | ${100}        | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                   | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${null}                   | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${null}                   | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${null}                   | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                   | ${'no-score'} | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${null}                   | ${'no-score'} | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${null}                   | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
	`(
		'getLabel($correctLabels, $incorrectLabels, $score, $isReview, $isSurvey, $hasResponse) = "$expectedValue"',
		({ correctLabels, incorrectLabels, score, isReview, isSurvey, hasResponse, expectedValue }) => {
			const spy = jest.spyOn(Math, 'random').mockReturnValue(0)

			expect(getLabel(correctLabels, incorrectLabels, score, isReview, isSurvey, hasResponse)).toBe(
				expectedValue
			)

			spy.mockRestore()
		}
	)
})
