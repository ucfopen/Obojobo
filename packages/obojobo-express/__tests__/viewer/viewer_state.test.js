jest.mock('../../db')
jest.mock('../../logger')

const Viewer = oboRequire('viewer/viewer_state')
const db = oboRequire('db')
const logger = oboRequire('logger')

describe('viewer state', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})
	test('set inserts values into view_state', done => {
		db.none.mockResolvedValueOnce({})

		Viewer.set(
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			'mockKey',
			'mockVersion',
			'mockValue'
		).then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO view_state'), {
				contentId: 'mockContentId',
				contents: {
					value: 'mockValue',
					version: 'mockVersion'
				},
				draftId: 'mockDraftId',
				initialContents: {
					mockKey: {
						value: 'mockValue',
						version: 'mockVersion'
					}
				},
				key: '{mockKey}',
				userId: 'mockUserId'
			})
			done()
		})
	})

	test('set fails on db error', done => {
		db.none.mockRejectedValueOnce('mockDBError')

		Viewer.set(
			'mockUserId',
			'mockDraftId',
			'mockContentId',
			'mockKey',
			'mockVersion',
			'mockValue'
		).then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO view_state'), {
				contentId: 'mockContentId',
				contents: {
					value: 'mockValue',
					version: 'mockVersion'
				},
				draftId: 'mockDraftId',
				initialContents: {
					mockKey: {
						value: 'mockValue',
						version: 'mockVersion'
					}
				},
				key: '{mockKey}',
				userId: 'mockUserId'
			})
			expect(logger.error).toHaveBeenCalledTimes(1)
			done()
		})
	})

	test('get retrives values from view_state', done => {
		db.oneOrNone.mockResolvedValueOnce({ payload: 'mockPayload' })

		Viewer.get('mockUserId', 'mockContentId').then(result => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining('SELECT view_state.payload, red_alert_status.red_alert'),
				{
					userId: 'mockUserId',
					contentId: 'mockContentId'
				}
			)
			expect(result).toEqual('mockPayload')
			done()
		})
	})

	test('get retrives empty if not found from view_state', done => {
		db.oneOrNone.mockResolvedValueOnce(null)

		Viewer.get('mockUserId', 'mockContentId').then(result => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining('SELECT view_state.payload, red_alert_status.red_alert'),
				{
					userId: 'mockUserId',
					contentId: 'mockContentId'
				}
			)
			expect(result).toEqual({})
			done()
		})
	})

	test('get retrives values from view_state', done => {
		db.oneOrNone.mockRejectedValueOnce('mockDBError')

		Viewer.get('mockUserId', 'mockContentId').then(() => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining('SELECT view_state.payload, red_alert_status.red_alert'),
				{
					userId: 'mockUserId',
					contentId: 'mockContentId'
				}
			)
			expect(logger.error).toHaveBeenCalledTimes(1)
			done()
		})
	})

	test('setRedAlert inserts values into red_alert_status', done => {
		db.none.mockResolvedValueOnce({})
		Viewer.setRedAlert('mockUserId', 'mockDraftId', 'mockTimestamp', 'mockValue').then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(
				expect.stringContaining('INSERT INTO red_alert_status'),
				{
					user_id: 'mockUserId',
					draft_id: 'mockDraftId',
					actor_time: 'mockTimestamp',
					red_alert: 'mockValue'
				}
			)
			done()
		})
	})

	test('setRedAlert fails on db error', done => {
		db.none.mockRejectedValueOnce('mockDBError')
		Viewer.setRedAlert('mockUserId', 'mockDraftId', 'mockTimestamp', 'mockValue').then(() => {
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(
				expect.stringContaining('INSERT INTO red_alert_status'),
				{
					user_id: 'mockUserId',
					draft_id: 'mockDraftId',
					actor_time: 'mockTimestamp',
					red_alert: 'mockValue'
				}
			)
			expect(logger.error).toHaveBeenCalledTimes(1)
			done()
		})
	})
})
