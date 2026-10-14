import { getLabel } from './feedback-labels'

describe('feedbackLabels', () => {
	test.each`
		correctLabels           | partialLabels           | incorrectLabels           | score         | isReview | isSurvey | hasResponse | expectedValue
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${false} | ${false} | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${false} | ${false} | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${false} | ${true}  | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${false} | ${true}  | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${true}  | ${false} | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${true}  | ${false} | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${true}  | ${true}  | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${50}         | ${true}  | ${true}  | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${null}                 | ${null}                   | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${false} | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${false} | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${true}  | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${true}  | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${false} | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${false} | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${true}  | ${false}    | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${true}  | ${true}     | ${'Partial Credit'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${false}    | ${'Correct!'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${true}     | ${'Correct!'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'Response recorded'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'Response recorded'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${null}                 | ${null}                 | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${false} | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${false} | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${false} | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${false} | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${false} | ${false} | ${false}    | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${false} | ${false} | ${true}     | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${false} | ${true}  | ${false}    | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${false} | ${true}  | ${true}     | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${true}  | ${false} | ${false}    | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${true}  | ${false} | ${true}     | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${true}  | ${true}  | ${false}    | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${50}         | ${true}  | ${true}  | ${true}     | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${null}                 | ${null}                   | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${null}       | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${false} | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${false}    | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${false} | ${true}  | ${true}     | ${'MockIncorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${false} | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${false}    | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${0}          | ${true}  | ${true}  | ${true}     | ${'Incorrect'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${false} | ${false}    | ${'MockPartialLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${false} | ${true}     | ${'MockPartialLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${true}  | ${false}    | ${'MockPartialLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${false} | ${true}  | ${true}     | ${'MockPartialLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${false} | ${false}    | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${false} | ${true}     | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${true}  | ${false}    | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${50}         | ${true}  | ${true}  | ${true}     | ${'Partial Credit'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${100}        | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${false} | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${false}    | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${false} | ${true}  | ${true}     | ${'MockCorrectLabel'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${false}    | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${false} | ${true}     | ${'Correct'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${false}    | ${'No response given'}
		${['MockCorrectLabel']} | ${['MockPartialLabel']} | ${['MockIncorrectLabel']} | ${'no-score'} | ${true}  | ${true}  | ${true}     | ${'Response recorded'}
	`(
		'getLabel($correctLabels, $partialLabels, $incorrectLabels, $score, $isReview, $isSurvey, $hasResponse) = "$expectedValue"',
		({
			correctLabels,
			partialLabels,
			incorrectLabels,
			score,
			isReview,
			isSurvey,
			hasResponse,
			expectedValue
		}) => {
			const spy = jest.spyOn(Math, 'random').mockReturnValue(0)

			expect(
				getLabel(
					correctLabels,
					partialLabels,
					incorrectLabels,
					score,
					isReview,
					isSurvey,
					hasResponse
				)
			).toBe(expectedValue)

			spy.mockRestore()
		}
	)
})
