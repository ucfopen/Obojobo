import getScoreChangeDescription from '../../../../../ObojoboDraft/Sections/Assessment/post-assessment/get-score-change-description'

describe.skip('AttemptIncompleteDialog', () => {
	test('getScoreChangedDescription with both scores null', () => {
		let response = getScoreChangeDescription(null, null)

		expect(response).toEqual('This did not change your recorded score')
	})

	test('getScoreChangedDescription with both scores null', () => {
		let response = getScoreChangeDescription(null, 90.56)

		expect(response).toEqual('✔ Your recorded score was updated to 91%')
	})

	test('getScoreChangedDescription with both scores null', () => {
		let response = getScoreChangeDescription(89.34, 90.56)

		expect(response).toEqual('✔ Your recorded score was updated from 89% to 91%')
	})

	test('getScoreChangedDescription with both scores null', () => {
		let response = getScoreChangeDescription(89.34, null)

		expect(response).toEqual('This did not change your recorded score of 89%')
	})
})
