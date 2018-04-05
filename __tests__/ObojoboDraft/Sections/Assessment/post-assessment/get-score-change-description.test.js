import { getScoreChangeDescription } from '../../../../../ObojoboDraft/Sections/Assessment/post-assessment/get-score-change-description'

describe('getScoreChangeDescription', () => {
	test('Shows old percentage to new percentage for two non-null scores where newer score is higher', () => {
		expect(getScoreChangeDescription(50, 100)).toEqual(
			'✔ Your recorded score was updated from 50% to 100%'
		)
	})

	test('Shows only new percentage when old score is null', () => {
		expect(getScoreChangeDescription(null, 50)).toEqual('✔ Your recorded score was updated to 50%')
	})

	test('Shows that score did not change when new score is the same', () => {
		expect(getScoreChangeDescription(100, 100)).toEqual(
			'This did not change your recorded score of 100%'
		)
	})

	test('Shows that score did not change when new score is null', () => {
		expect(getScoreChangeDescription(100, null)).toEqual(
			'This did not change your recorded score of 100%'
		)
	})

	test('Shows that null score did not change when new score is null (But does not show percentage)', () => {
		expect(getScoreChangeDescription(null, null)).toEqual('This did not change your recorded score')
	})
})
