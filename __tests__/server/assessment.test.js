import Assessment from '../../server/assessment'
import db from '../../../../db'

jest.mock('../../../../db', () => {
	return {
		one: jest.fn(),
		manyOrNone: jest.fn()
	}
})

describe('Assessment', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('getCompletedAssessmentAttemptHistory calls db', () => {
		Assessment.getCompletedAssessmentAttemptHistory(0, 1, 2, false)

		expect(db.manyOrNone).toHaveBeenCalled()
		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			userId: 0,
			draftId: 1,
			assessmentId: 2
		})
	})

	test('getAttemptHistory', () => {
		Assessment.getAttemptHistory(0, 1)

		expect(db.manyOrNone).toHaveBeenCalled()
		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			userId: 0,
			draftId: 1
		})
	})

	test('insertNewAttempt', () => {
		Assessment.insertNewAttempt(0, 1, 2, 3, 4)

		expect(db.one).toHaveBeenCalled()
		expect(db.one.mock.calls[0][1]).toEqual({
			userId: 0,
			draftId: 1,
			assessmentId: 2,
			state: 3,
			isPreview: 4
		})
	})

	test('updateAttempt', () => {
		Assessment.updateAttempt(0, 1)

		expect(db.one).toHaveBeenCalled()
		expect(db.one.mock.calls[0][1]).toEqual({
			result: 0,
			attemptId: 1
		})
	})

	test('creates its own instance correctly', () => {
		Assessment.prototype.registerEvents = jest.fn()

		let assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		expect(assessment.registerEvents).toHaveBeenCalledWith({
			'internal:sendToClient': assessment.onSendToClient,
			'internal:startVisit': assessment.onStartVisit
		})
	})

	test('onSendToClient yells', () => {
		Assessment.prototype.yell = jest.fn()

		let assessment = new Assessment(
			{
				draftTree: true
			},
			{
				node: true
			},
			jest.fn()
		)

		assessment.onSendToClient('req', 'res')

		expect(assessment.yell).toHaveBeenCalledWith(
			'ObojoboDraft.Sections.Assessment:sendToClient',
			'req',
			'res'
		)
	})

	test('getNumberAttemptsTaken calls db', done => {
		db.one.mockImplementationOnce(() => {
			return Promise.resolve({ count: 123 })
		})

		Assessment.getNumberAttemptsTaken(0, 1, 2).then(n => {
			expect(n).toBe(123)
			done()
		})
	})
})
