jest.mock('../../db')
jest.mock('../../logger')

let Viewer = oboRequire('viewer/viewer_state')
let db = oboRequire('db')
let logger = oboRequire('logger')

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
				expect.stringContaining('SELECT payload FROM view_state'),
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
				expect.stringContaining('SELECT payload FROM view_state'),
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

		Viewer.get('mockUserId', 'mockContentId').then(result => {
			expect(db.oneOrNone).toHaveBeenCalledTimes(1)
			expect(db.oneOrNone).toHaveBeenCalledWith(
				expect.stringContaining('SELECT payload FROM view_state'),
				{
					userId: 'mockUserId',
					contentId: 'mockContentId'
				}
			)
			expect(logger.error).toHaveBeenCalledTimes(1)
			done()
		})
	})
})
